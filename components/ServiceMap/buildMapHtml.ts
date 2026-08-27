import type { ServiceItem } from "@/data/services";
import type { ServiceMapProps } from "@/components/ServiceMap/types";

const isValidCoord = (s: Pick<ServiceItem, "lat" | "lng">) =>
  Number.isFinite(s.lat) && Number.isFinite(s.lng) && Math.abs(s.lat) <= 90 && Math.abs(s.lng) <= 180;

export function buildMapHtml(
  region: ServiceMapProps["region"],
  items: ServiceItem[],
  openInMapsLabel: string,
) {
  const markers = items.filter(isValidCoord).map((s) => ({
    id: s.service_id,
    name: s.name,
    address: s.address,
    hours: s.hours_en,
    lat: s.lat,
    lng: s.lng,
  }));
  const payload = JSON.stringify({
    latitude: region.latitude,
    longitude: region.longitude,
    markers,
    openInMapsLabel,
  }).replace(/</g, "\\u003c");

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <style>
    html, body, #map { height: 100%; margin: 0; padding: 0; background: #f8f5f0; }
    .leaflet-popup-content { font-size: 16px; line-height: 1.35; margin: 12px 14px; }
    .leaflet-popup-content button {
      display: block; width: 100%; margin-top: 10px; min-height: 44px;
      border: 0; border-radius: 10px; background: #1B4332; color: #fff;
      font-size: 16px; font-weight: 600;
    }
  </style>
</head>
<body>
  <div id="map"></div>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script>
    (function () {
      var data = ${payload};
      function post(msg) {
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(JSON.stringify(msg));
          return;
        }
        if (msg.type === "open") {
          var q = encodeURIComponent(msg.address || msg.name || (msg.lat + "," + msg.lng));
          window.open("https://www.google.com/maps/search/?api=1&query=" + q, "_blank");
        }
      }
      function esc(s) {
        return String(s)
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;");
      }
      try {
        if (!window.L) { post({ type: "error", message: "map library missing" }); return; }
        var map = L.map("map", { zoomControl: true });
        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "&copy; OpenStreetMap",
          maxZoom: 19
        }).addTo(map);
        var markers = data.markers || [];
        if (!markers.length) {
          map.setView([data.latitude, data.longitude], 12);
          return;
        }
        var group = L.featureGroup();
        markers.forEach(function (m, i) {
          var marker = L.circleMarker([m.lat, m.lng], {
            radius: 10,
            color: "#1B4332",
            weight: 2,
            fillColor: "#40916C",
            fillOpacity: 0.95
          });
          var detail = m.address || m.hours || "";
          marker.bindPopup(
            "<strong>" + esc(m.name) + "</strong>" +
            (detail ? "<br/>" + esc(detail) : "") +
            "<button type='button' id='dir-" + i + "'>" + esc(data.openInMapsLabel) + "</button>"
          );
          marker.on("popupopen", function () {
            var el = document.getElementById("dir-" + i);
            if (el) {
              el.onclick = function () {
                post({ type: "open", lat: m.lat, lng: m.lng, name: m.name, address: m.address });
              };
            }
          });
          group.addLayer(marker);
        });
        group.addTo(map);
        if (markers.length === 1) map.setView([markers[0].lat, markers[0].lng], 14);
        else map.fitBounds(group.getBounds().pad(0.25));
      } catch (e) {
        post({ type: "error", message: String(e && e.message ? e.message : e) });
      }
    })();
  </script>
</body>
</html>`;
}

export { isValidCoord };
