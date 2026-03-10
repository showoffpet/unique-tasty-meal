"use client";

import { useEffect, useRef } from "react";

export interface PlaceResult {
  street_address: string;
  city: string;
  postal_code: string;
  state: string;
  country: string;
  formatted_address: string;
}

interface UsePlaceAutocompleteOptions {
  onPlaceSelected: (place: PlaceResult) => void;
  componentRestrictions?: { country: string | string[] };
  types?: string[];
}

// Singleton script loader to avoid loading the Google Maps script multiple times
let mapsLoadPromise: Promise<void> | null = null;

function loadGoogleMapsScript(apiKey: string): Promise<void> {
  if (mapsLoadPromise) return mapsLoadPromise;

  mapsLoadPromise = new Promise<void>((resolve, reject) => {
    // If already loaded
    if (
      typeof google !== "undefined" &&
      google.maps?.places?.PlaceAutocompleteElement
    ) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&v=weekly&loading=async`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => {
      mapsLoadPromise = null;
      reject(new Error("Failed to load Google Maps script"));
    };
    document.head.appendChild(script);
  });

  return mapsLoadPromise;
}

export function usePlaceAutocomplete({
  onPlaceSelected,
  componentRestrictions,
  types,
}: UsePlaceAutocompleteOptions) {
  const containerRef = useRef<HTMLDivElement>(null);
  const callbackRef = useRef(onPlaceSelected);

  // Keep the callback ref up to date inside an effect (not during render)
  useEffect(() => {
    callbackRef.current = onPlaceSelected;
  }, [onPlaceSelected]);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

    let autocompleteEl: HTMLElement | null = null;

    const init = async () => {
      try {
        await loadGoogleMapsScript(apiKey);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const PlaceAutocompleteElement = (google.maps.places as any)
          .PlaceAutocompleteElement;

        if (!PlaceAutocompleteElement) {
          console.error("PlaceAutocompleteElement not available");
          return;
        }

        autocompleteEl = new PlaceAutocompleteElement({
          componentRestrictions: componentRestrictions || undefined,
          types: types || ["address"],
        });

        (autocompleteEl as HTMLElement).style.width = "100%";
        container.appendChild(autocompleteEl as HTMLElement);

        const handlePlaceSelect = async (event: Event) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const placePrediction = (event as any).placePrediction;
          if (!placePrediction) return;

          const place = placePrediction.toPlace();
          await place.fetchFields({
            fields: ["displayName", "formattedAddress", "addressComponents"],
          });

          let streetNumber = "";
          let route = "";
          let city = "";
          let postal = "";
          let state = "";
          let country = "";

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          place.addressComponents?.forEach((component: any) => {
            const componentTypes: string[] = component.types;
            if (componentTypes.includes("street_number")) {
              streetNumber = component.longText || "";
            }
            if (componentTypes.includes("route")) {
              route = component.longText || "";
            }
            if (componentTypes.includes("locality")) {
              city = component.longText || "";
            }
            if (componentTypes.includes("postal_code")) {
              postal = component.longText || "";
            }
            if (componentTypes.includes("administrative_area_level_1")) {
              state = component.shortText || "";
            }
            if (componentTypes.includes("country")) {
              country = component.shortText || "";
            }
          });

          const street = streetNumber
            ? `${streetNumber} ${route}`
            : route || place.displayName || "";

          callbackRef.current({
            street_address: street || place.formattedAddress || "",
            city,
            postal_code: postal,
            state,
            country,
            formatted_address: place.formattedAddress || "",
          });
        };

        (autocompleteEl as HTMLElement).addEventListener(
          "gmp-placeselect",
          handlePlaceSelect,
        );

        // Store cleanup handler on the element for teardown
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (autocompleteEl as any)._cleanup = () => {
          (autocompleteEl as HTMLElement).removeEventListener(
            "gmp-placeselect",
            handlePlaceSelect,
          );
        };
      } catch (err) {
        console.error("Failed to load Google Places:", err);
      }
    };

    init();

    return () => {
      if (autocompleteEl && container.contains(autocompleteEl)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (autocompleteEl as any)._cleanup?.();
        container.removeChild(autocompleteEl);
      }
    };
    // We intentionally only run on mount — restrictions and types are static config
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { containerRef };
}
