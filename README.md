Display location data from google sheet on Mapbox.

1. Open a mapbox.com account.
2. Get mapbox access token.
3. Replace mapbox access token in app.js .
4. Create a Google Sheet with 6 columns: "id","lng","lat","css_background","title","description"
    id = data id (optional)
    lng = longitude
    lat = latitude
    css_background = css code for location icon (optional)
        example 1: radial-gradient(green,green)
        example 2: url('http://link.to/your/image.jpg')
    title = title of the location
    description = description of the location
5. Publish the google sheet.
6. Get sheet id.
7. Show your locations on : http://yourdomain.com/?sid=your_google_sheet_id