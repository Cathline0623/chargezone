// export const MAP_CFG = {
//     pinLat: 23.0300,
//     pinLng: 72.5900,

//     // Calibrated using the successful EV station tap
//     centerLat: 23.0167290277,
//     centerLng: 72.5673406982,

//     zoom: 14,
//     tileSize: 256,

//     mapViewport: {
//         left: 0,
//         top: 520,
//         right: 1080,
//         bottom: 2086
//     }
// };

// function latLngToWorld(lat, lng, zoom, tileSize) {
//     const scale = tileSize * Math.pow(2, zoom);
//     const x = ((lng + 180) / 360) * scale;

//     const sinLat = Math.sin(lat * Math.PI / 180);

//     const y = (
//         0.5 -
//         Math.log((1 + sinLat) / (1 - sinLat)) / (4 * Math.PI)
//     ) * scale;

//     return { x, y };
// }

// // overrides: { pinLat, pinLng } (datasheet / API-la irundhu). Mattha values MAP_CFG-la irundhu varum.
// export async function tapByLatLng(overrides = {}) {
//     const cfg = { ...MAP_CFG, ...overrides };

//     const pin = latLngToWorld(
//         cfg.pinLat,
//         cfg.pinLng,
//         cfg.zoom,
//         cfg.tileSize
//     );

//     const center = latLngToWorld(
//         cfg.centerLat,
//         cfg.centerLng,
//         cfg.zoom,
//         cfg.tileSize
//     );

//     const viewport = cfg.mapViewport;

//     const mapCenterX = (viewport.left + viewport.right) / 2;
//     const mapCenterY = (viewport.top + viewport.bottom) / 2;

//     const x = Math.round(mapCenterX + pin.x - center.x);
//     const y = Math.round(mapCenterY + pin.y - center.y);

//     console.log('Map Viewport:', viewport);
//     console.log('Target EV Location:', {
//         latitude: cfg.pinLat,
//         longitude: cfg.pinLng
//     });

//     console.log('Calculated EV Coordinates:', { x, y });

//     if (
//         x < viewport.left ||
//         x >= viewport.right ||
//         y < viewport.top ||
//         y >= viewport.bottom
//     ) {
//         throw new Error(`EV marker outside map viewport: ${x}, ${y}`);
//     }

//     await driver.saveScreenshot('./reports/before_pin_tap.png');

//     await driver.execute('mobile: clickGesture', { x, y });

//     await driver.pause(3000);

//     await driver.saveScreenshot('./reports/after_pin_tap.png');

//     const pageSource = await driver.getPageSource();

//     console.log('PAGE SOURCE AFTER EV TAP:\n', pageSource);

//     return { x, y };
// }


// export function calibrateCenter(
//     pinLat,
//     pinLng,
//     pinX,
//     pinY,
//     cfg = MAP_CFG
// ) {
//     const pin = latLngToWorld(
//         pinLat,
//         pinLng,
//         cfg.zoom,
//         cfg.tileSize
//     );

//     const viewport = cfg.mapViewport;

//     const mapCenterX =
//         (viewport.left + viewport.right) / 2;

//     const mapCenterY =
//         (viewport.top + viewport.bottom) / 2;

//     const worldX = pin.x - (pinX - mapCenterX);
//     const worldY = pin.y - (pinY - mapCenterY);

//     const scale =
//         cfg.tileSize * Math.pow(2, cfg.zoom);

//     const centerLng =
//         (worldX / scale) * 360 - 180;

//     const centerLat =
//         (Math.atan(
//             Math.sinh(
//                 Math.PI * (1 - (2 * worldY) / scale)
//             )
//         ) * 180) / Math.PI;

//     const result = {
//         centerLat,
//         centerLng
//     };

//     console.log('Calibrated Map Center:', result);

//     return result;
// }


export const MAP_CFG = {
    pinLat: 23.0300,
    pinLng: 72.5900,

    // Calibrated map center
    centerLat: 23.0167290277,
    centerLng: 72.5673406982,

    zoom: 14,
    tileSize: 256,

    mapViewport: {
        left: 0,
        top: 520,
        right: 1080,
        bottom: 2086
    }
};

function latLngToWorld(lat, lng, zoom, tileSize) {
    const scale = tileSize * Math.pow(2, zoom);
    const x = ((lng + 180) / 360) * scale;
    const sinLat = Math.sin(lat * Math.PI / 180);

    const y = (
        0.5 -
        Math.log((1 + sinLat) / (1 - sinLat)) / (4 * Math.PI)
    ) * scale;

    return { x, y };
}

export function calibrateCenter(pinLat, pinLng, pinX, pinY, cfg = MAP_CFG) {
    const pin = latLngToWorld(pinLat, pinLng, cfg.zoom, cfg.tileSize);
    const viewport = cfg.mapViewport;

    const mapCenterX = (viewport.left + viewport.right) / 2;
    const mapCenterY = (viewport.top + viewport.bottom) / 2;

    const worldX = pin.x - (pinX - mapCenterX);
    const worldY = pin.y - (pinY - mapCenterY);
    const scale = cfg.tileSize * Math.pow(2, cfg.zoom);

    const centerLng = (worldX / scale) * 360 - 180;
    const centerLat = (
        Math.atan(Math.sinh(Math.PI * (1 - (2 * worldY) / scale))) * 180
    ) / Math.PI;

    const result = { centerLat, centerLng };

    console.log('Calibrated Map Center:', result);

    return result;
}



export async function tapByLatLng(overrides = {}) {
    const cfg = { ...MAP_CFG, ...overrides };

    // Calibrate using the actual Test Station 11 marker position
    const calibratedCenter = calibrateCenter(
        cfg.pinLat,
        cfg.pinLng,
        236,
        893,
        cfg
    );

    console.log('Calibration Check:', calibratedCenter);

    const pin = latLngToWorld(
        cfg.pinLat,
        cfg.pinLng,
        cfg.zoom,
        cfg.tileSize
    );

    // Use calibrated center instead of the old MAP_CFG center
    const center = latLngToWorld(
        calibratedCenter.centerLat,
        calibratedCenter.centerLng,
        cfg.zoom,
        cfg.tileSize
    );

    const viewport = cfg.mapViewport;

    const mapCenterX = (viewport.left + viewport.right) / 2;
    const mapCenterY = (viewport.top + viewport.bottom) / 2;

    const x = Math.round(mapCenterX + pin.x - center.x);
    const y = Math.round(mapCenterY + pin.y - center.y);

    console.log('Map Viewport:', viewport);
    console.log('Target EV Location:', {
        latitude: cfg.pinLat,
        longitude: cfg.pinLng
    });

    console.log('Calculated EV Coordinates:', { x, y });

    if (
        x < viewport.left ||
        x >= viewport.right ||
        y < viewport.top ||
        y >= viewport.bottom
    ) {
        throw new Error(`EV marker outside map viewport: ${x}, ${y}`);
    }

    await driver.saveScreenshot('./reports/before_pin_tap.png');

    await driver.execute('mobile: clickGesture', { x, y });

    await driver.pause(3000);

    await driver.saveScreenshot('./reports/after_pin_tap.png');

    const pageSource = await driver.getPageSource();

    console.log('PAGE SOURCE AFTER EV TAP:\n', pageSource);

    return { x, y };
}
