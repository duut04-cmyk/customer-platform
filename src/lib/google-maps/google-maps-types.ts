export type GoogleMapsLatLng = {
  lat(): number;
  lng(): number;
};

export type GoogleMapsPlace = {
  fetchFields(options: { fields: string[] }): Promise<void>;
  formattedAddress?: string;
  displayName?: string;
  location?: GoogleMapsLatLng | null;
};

export type GoogleMapsPlacePrediction = {
  toPlace(): GoogleMapsPlace;
};

export type GoogleMapsPlaceSelectEvent = Event & {
  placePrediction: GoogleMapsPlacePrediction;
};

export type GoogleMapsPlaceAutocompleteElement = HTMLElement & {
  placeholder: string;
  value: string;
  componentRestrictions?: { country: string | string[] };
};

export type GoogleMapsPlaceAutocompleteConstructor = new (options?: {
  componentRestrictions?: { country: string | string[] };
}) => GoogleMapsPlaceAutocompleteElement;

export type GoogleMapsGeocoderResult = {
  formatted_address?: string;
  geometry?: {
    location?: GoogleMapsLatLng | null;
  };
};

export type GoogleMapsGeocoder = {
  geocode(
    request:
      { location: { lat: number; lng: number } } | { address: string; region?: string },
    callback: (results: GoogleMapsGeocoderResult[] | null, status: string) => void,
  ): void;
};

export type GoogleMapsGeocoderConstructor = new () => GoogleMapsGeocoder;

export type GoogleMapsPlacesLibrary = {
  PlaceAutocompleteElement: GoogleMapsPlaceAutocompleteConstructor;
};

export type GoogleMapsGeocodingLibrary = {
  Geocoder: GoogleMapsGeocoderConstructor;
};

export type GoogleMapsLatLngLiteral = {
  lat: number;
  lng: number;
};

export type GoogleMapsLatLngBounds = {
  extend(point: GoogleMapsLatLngLiteral | GoogleMapsLatLng): void;
  isEmpty(): boolean;
};

export type GoogleMapsMap = {
  fitBounds(
    bounds: GoogleMapsLatLngBounds,
    padding?: number | { top: number; right: number; bottom: number; left: number },
  ): void;
  setCenter(center: GoogleMapsLatLngLiteral): void;
  setZoom(zoom: number): void;
};

export type GoogleMapsMapConstructor = new (
  element: HTMLElement,
  options?: {
    center?: GoogleMapsLatLngLiteral;
    zoom?: number;
    mapTypeControl?: boolean;
    streetViewControl?: boolean;
    fullscreenControl?: boolean;
    zoomControl?: boolean;
    clickableIcons?: boolean;
    gestureHandling?: string;
  },
) => GoogleMapsMap;

export type GoogleMapsMarker = {
  setMap(map: GoogleMapsMap | null): void;
  setPosition(position: GoogleMapsLatLngLiteral | null): void;
  setTitle(title: string): void;
};

export type GoogleMapsMarkerConstructor = new (options?: {
  map?: GoogleMapsMap | null;
  position?: GoogleMapsLatLngLiteral;
  title?: string;
  label?: string | { text: string; color?: string; fontWeight?: string };
  icon?: {
    path?: unknown;
    scale?: number;
    fillColor?: string;
    fillOpacity?: number;
    strokeColor?: string;
    strokeWeight?: number;
  };
}) => GoogleMapsMarker;

export type GoogleMapsDirectionsLeg = {
  distance?: { text?: string; value?: number };
  duration?: { text?: string; value?: number };
  start_location?: GoogleMapsLatLng;
  end_location?: GoogleMapsLatLng;
};

export type GoogleMapsDirectionsRoute = {
  legs: GoogleMapsDirectionsLeg[];
};

export type GoogleMapsDirectionsResult = {
  routes: GoogleMapsDirectionsRoute[];
};

export type GoogleMapsDirectionsRequest = {
  origin: string | GoogleMapsLatLngLiteral;
  destination: string | GoogleMapsLatLngLiteral;
  travelMode: string;
  region?: string;
};

export type GoogleMapsDirectionsService = {
  route(
    request: GoogleMapsDirectionsRequest,
    callback: (result: GoogleMapsDirectionsResult | null, status: string) => void,
  ): void;
};

export type GoogleMapsDirectionsRenderer = {
  setMap(map: GoogleMapsMap | null): void;
  setDirections(directions: GoogleMapsDirectionsResult): void;
  setOptions(options: {
    suppressMarkers?: boolean;
    polylineOptions?: {
      strokeColor?: string;
      strokeWeight?: number;
      strokeOpacity?: number;
    };
  }): void;
};

export type GoogleMapsMapsLibrary = {
  Map: GoogleMapsMapConstructor;
  LatLngBounds: new () => GoogleMapsLatLngBounds;
  Marker?: GoogleMapsMarkerConstructor;
  SymbolPath?: { CIRCLE: unknown };
};

export type GoogleMapsRoutesLibrary = {
  DirectionsService: new () => GoogleMapsDirectionsService;
  DirectionsRenderer: new (options?: {
    map?: GoogleMapsMap | null;
    suppressMarkers?: boolean;
    polylineOptions?: {
      strokeColor?: string;
      strokeWeight?: number;
      strokeOpacity?: number;
    };
  }) => GoogleMapsDirectionsRenderer;
  TravelMode: { DRIVING: string };
};

type GoogleMapsImportLibrary = (name: string) => Promise<unknown>;

export type GoogleMapsBootstrap = {
  maps: {
    importLibrary: GoogleMapsImportLibrary;
    Geocoder?: GoogleMapsGeocoderConstructor;
  };
};

export function readGoogleMapsBootstrap(): GoogleMapsBootstrap | null {
  const candidate = window.google as Partial<GoogleMapsBootstrap> | undefined;
  if (candidate?.maps?.importLibrary) {
    return candidate as GoogleMapsBootstrap;
  }
  return null;
}
