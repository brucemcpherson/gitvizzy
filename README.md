<link rel="stylesheet" href="https://cdn.materialdesignicons.com/5.4.55/css/materialdesignicons.min.css">


There are so many Apps Script projects out there where the source code is published on Github, but it’s hard to find what you want. Whether it’s a library, an example of an add-on, how to use an advanced service, or just see who is working on what. I fugured it would be nice if we had a searchable visualization of everything that’s public.

## writeup

https://ramblings.mcpher.com/vizzy-scrviz/

## live app

https://scrviz.web.app

## the data

https://ramblings.mcpher.com/vizzy-scrviz/searching-github-gas/

## screen shots

Summary view
![](./shots/2021-01-26-11-26-29.png)

Detail view with filter and owner info
![](./shots/2021-01-26-11-28-26.png)

Filtered view of manifest entry
![](./shots/2021-01-26-11-29-54.png)

Filtered view of manifest contents
![](./shots/2021-01-26-11-30-40.png)

## scrviz now supports creating apps script projects directly

https://ramblings.mcpher.com/vizzy-scrviz/vizzy-clone-apps-script-github/


## icons available for scrvizprofile 


Any icon from material design icons site can be added to your scrviz-profile.json. These must be specified in full (including the 'mdi-')
````
rows: [
{
    ...etc,
    "icon": "mdi-google-ads"
}
]
````
However, to preserve some kind of conformity across users, a set of short names is available and preferred. Here's the list in no particular order. Many of these are also used in the app itself. If you'd like one added, let me know. Note that some are actually images rather than logos.

You'd use these like this
````
rows: [
{
    ...etc,
    "icon": "youtube"
}
]
````

| name | represents |
| --- | --- |
| <span class="mdi mdi-code-json"></span> | json |
| <span class="mdi mdi-tag-multiple"></span> | tags |
| <span class="mdi mdi-microsoft-excel"></span> | excel |
| <span class="mdi mdi-microsoft-word"></span> | word |
| <span class="mdi mdi-microsoft-office"></span> | office |
| <span class="mdi mdi-microsoft-windows"></span> | windows |
| <span class="mdi mdi-youtube"></span> | youtube |
| <span class="mdi mdi-linkedin"></span> | linkedin |
| <span class="mdi mdi-information"></span> | info |
| <span class="mdi mdi-filter-off"></span> | filter-off |
| <span class="mdi mdi-filter"></span> | filter-on |
| <span class="mdi mdi-open-in-new"></span> | open |
| <span class="mdi mdi-office-building"></span> | company |
| <span class="mdi mdi-microsoft-word"></span> | word |
| <span class="mdi mdi-microsoft-office"></span> | office |
| <span class="mdi mdi-microsoft-windows"></span> | windows |
| <span class="mdi mdi-youtube"></span> | youtube |
| <span class="mdi mdi-linkedin"></span> | linkedin |
| <span class="mdi mdi-information"></span> | info |
| <span class="mdi mdi-map-marker"></span> | location |
| <span class="mdi mdi-email"></span> | email |
| <span class="mdi mdi-briefcase"></span> | files |
| <span class="mdi mdi-file"></span> | file |
| <span class="mdi mdi-github"></span> | github |
| <span class="mdi mdi-package-variant"></span> | clasp |
| <span class="mdi mdi-table-eye"></span> | stats |
| <span class="mdi mdi-web"></span> | webapp |
| <span class="mdi mdi-account-key"></span> | access |
| <span class="mdi mdi-comment"></span> | viz-info |
| <span class="mdi mdi-folder"></span> | repos |
| <span class="mdi mdi-database"></span> | libraries |
| <span class="mdi mdi-twitter"></span> | twitter |
| <span class="mdi mdi-google-maps"></span> | maps |
| <span class="mdi mdi-bio"></span> | bio |
| <span class="mdi mdi-cash-multiple"></span> | fees |
| <span class="mdi mdi-lifebuoy"></span> | support |
| <span class="mdi mdi-text"></span> | text |
| <span class="mdi mdi-cash-multiple"></span> | fees |
| <span class="mdi mdi-currency-usd"></span> | hireable |
| <span class="mdi mdi-currency-usd-off"></span> | hireable-off |
| <span class="mdi mdi-text"></span> | text |
| <span class="mdi mdi-account-group"></span> | followers |
| <span class="mdi mdi-counter"></span> | version |
| <span class="mdi mdi-feather"></span> | symbol |
| <span class="mdi mdi-blogger"></span> | blog |
| <span class="mdi mdi-identifier"></span> | id |
| <span class="mdi mdi-lock-plus"></span> | auth |
| <span class="mdi mdi-language-html5"></span> | html |
| <span class="mdi mdi-semantic-web"></span> | scrviz |
| <span class="mdi mdi-phone"></span> | phone |
| <img src="./src/assets/appsscript.png" height="20"/>| appsscript |
| <img src="./src/assets/GoogleDrive_2020.png" height="20"/>| drive |
| <img src="./src/assets/Sheets_2020.png" height="20"/>| sheets |
| <img src="./src/assets/Docs_2020.png" height="20"/>| docs |
| <img src="./src/assets/GoogleCalendar_2020.png" height="20"/>| calendar |
| <img src="./src/assets/Gmail_2020.png" height="20"/>| gmail |
| <img src="./src/assets/Slides_2020.png" height="20"/>| slides |
| <img src="./src/assets/gcp.png" height="20"/>| gcp |
