


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

```
rows: [
{
    ...etc,
    "icon": "mdi-google-ads"
}
]
```

However, to preserve some kind of conformity across users, a set of short names is available and preferred. Here's the list in no particular order. Many of these are also used in the app itself. If you'd like one added, let me know. Note that some are actually images rather than logos.

You'd use these like this

```
rows: [
{
    ...etc,
    "icon": "youtube"
}
]
```

| icon                                                          | built in name   |
| ------------------------------------------------------------- | ------------ |
| <img src="https://cdn.jsdelivr.net/npm/@mdi/svg@5.9.55/svg/code-json.svg" height="24" />                  | json         |
| <img src="https://cdn.jsdelivr.net/npm/@mdi/svg@5.9.55/svg/tag-multiple.svg" height="24" />                    | tags         |
| <img src="https://cdn.jsdelivr.net/npm/@mdi/svg@5.9.55/svg/microsoft-excel.svg" height="24" />                 | excel        |
| <img src="https://cdn.jsdelivr.net/npm/@mdi/svg@5.9.55/svg/microsoft-word.svg" height="24" />                  | word         |
| <img src="https://cdn.jsdelivr.net/npm/@mdi/svg@5.9.55/svg/microsoft-office.svg" height="24" />                | office       |
| <img src="https://cdn.jsdelivr.net/npm/@mdi/svg@5.9.55/svg/microsoft-windows.svg" height="24" />               | windows      |
| <img src="https://cdn.jsdelivr.net/npm/@mdi/svg@5.9.55/svg/youtube.svg" height="24" />                         | youtube      |
| <img src="https://cdn.jsdelivr.net/npm/@mdi/svg@5.9.55/svg/linkedin.svg" height="24" />                        | linkedin     |
| <img src="https://cdn.jsdelivr.net/npm/@mdi/svg@5.9.55/svg/information.svg" height="24" />                     | info         |
| <img src="https://cdn.jsdelivr.net/npm/@mdi/svg@5.9.55/svg/filter-off.svg" height="24" />                      | filter-off   |
| <img src="https://cdn.jsdelivr.net/npm/@mdi/svg@5.9.55/svg/filter.svg" height="24" />                          | filter-on    |
| <img src="https://cdn.jsdelivr.net/npm/@mdi/svg@5.9.55/svg/open-in-new.svg" height="24" />                     | open         |
| <img src="https://cdn.jsdelivr.net/npm/@mdi/svg@5.9.55/svg/office-building.svg" height="24" />                 | company      |
| <img src="https://cdn.jsdelivr.net/npm/@mdi/svg@5.9.55/svg/microsoft-word.svg" height="24" />                  | word         |
| <img src="https://cdn.jsdelivr.net/npm/@mdi/svg@5.9.55/svg/microsoft-office.svg" height="24" />                | office       |
| <img src="https://cdn.jsdelivr.net/npm/@mdi/svg@5.9.55/svg/microsoft-windows.svg" height="24" />               | windows      |
| <img src="https://cdn.jsdelivr.net/npm/@mdi/svg@5.9.55/svg/youtube.svg" height="24" />                         | youtube      |
| <img src="https://cdn.jsdelivr.net/npm/@mdi/svg@5.9.55/svg/linkedin.svg" height="24" />                        | linkedin     |
| <img src="https://cdn.jsdelivr.net/npm/@mdi/svg@5.9.55/svg/information.svg" height="24" />                     | info         |
| <img src="https://cdn.jsdelivr.net/npm/@mdi/svg@5.9.55/svg/map-marker.svg" height="24" />                      | location     |
| <img src="https://cdn.jsdelivr.net/npm/@mdi/svg@5.9.55/svg/email.svg" height="24" />                           | email        |
| <img src="https://cdn.jsdelivr.net/npm/@mdi/svg@5.9.55/svg/briefcase.svg" height="24" />                       | files        |
| <img src="https://cdn.jsdelivr.net/npm/@mdi/svg@5.9.55/svg/file.svg" height="24" />                            | file         |
| <img src="https://cdn.jsdelivr.net/npm/@mdi/svg@5.9.55/svg/github.svg" height="24" />                          | github       |
| <img src="https://cdn.jsdelivr.net/npm/@mdi/svg@5.9.55/svg/package-variant.svg" height="24" />                 | clasp        |
| <img src="https://cdn.jsdelivr.net/npm/@mdi/svg@5.9.55/svg/table-eye.svg" height="24" />                       | stats        |
| <img src="https://cdn.jsdelivr.net/npm/@mdi/svg@5.9.55/svg/web.svg" height="24" />                             | webapp       |
| <img src="https://cdn.jsdelivr.net/npm/@mdi/svg@5.9.55/svg/account-key.svg" height="24" />                     | access       |
| <img src="https://cdn.jsdelivr.net/npm/@mdi/svg@5.9.55/svg/comment.svg" height="24" />                         | viz-info     |
| <img src="https://cdn.jsdelivr.net/npm/@mdi/svg@5.9.55/svg/folder.svg" height="24" />                          | repos        |
| <img src="https://cdn.jsdelivr.net/npm/@mdi/svg@5.9.55/svg/database.svg" height="24" />                        | libraries    |
| <img src="https://cdn.jsdelivr.net/npm/@mdi/svg@5.9.55/svg/twitter.svg" height="24" />                         | twitter      |
| <img src="https://cdn.jsdelivr.net/npm/@mdi/svg@5.9.55/svg/google-maps.svg" height="24" />                     | maps         |
| <img src="https://cdn.jsdelivr.net/npm/@mdi/svg@5.9.55/svg/bio.svg" height="24" />                             | bio          |
| <img src="https://cdn.jsdelivr.net/npm/@mdi/svg@5.9.55/svg/cash-multiple.svg" height="24" />                   | fees         |
| <img src="https://cdn.jsdelivr.net/npm/@mdi/svg@5.9.55/svg/lifebuoy.svg" height="24" />                        | support      |
| <img src="https://cdn.jsdelivr.net/npm/@mdi/svg@5.9.55/svg/text.svg" height="24" />                            | text         |
| <img src="https://cdn.jsdelivr.net/npm/@mdi/svg@5.9.55/svg/cash-multiple.svg" height="24" />                   | fees         |
| <img src="https://cdn.jsdelivr.net/npm/@mdi/svg@5.9.55/svg/currency-usd.svg" height="24" />                    | hireable     |
| <img src="https://cdn.jsdelivr.net/npm/@mdi/svg@5.9.55/svg/currency-usd-off.svg" height="24" />                | hireable-off |
| <img src="https://cdn.jsdelivr.net/npm/@mdi/svg@5.9.55/svg/text.svg" height="24" />                            | text         |
| <img src="https://cdn.jsdelivr.net/npm/@mdi/svg@5.9.55/svg/account-group.svg" height="24" />                   | followers    |
| <img src="https://cdn.jsdelivr.net/npm/@mdi/svg@5.9.55/svg/counter.svg" height="24" />                         | version      |
| <img src="https://cdn.jsdelivr.net/npm/@mdi/svg@5.9.55/svg/feather.svg" height="24" />                         | symbol       |
| <img src="https://cdn.jsdelivr.net/npm/@mdi/svg@5.9.55/svg/blogger.svg" height="24" />                         | blog         |
| <img src="https://cdn.jsdelivr.net/npm/@mdi/svg@5.9.55/svg/identifier.svg" height="24" />                      | id           |
| <img src="https://cdn.jsdelivr.net/npm/@mdi/svg@5.9.55/svg/lock-plus.svg" height="24" />                       | auth         |
| <img src="https://cdn.jsdelivr.net/npm/@mdi/svg@5.9.55/svg/language-html5.svg" height="24" />                  | html         |
| <img src="https://cdn.jsdelivr.net/npm/@mdi/svg@5.9.55/svg/semantic-web.svg" height="24" />                    | scrviz       |
| <img src="https://cdn.jsdelivr.net/npm/@mdi/svg@5.9.55/svg/phone.svg" height="24" />                           | phone        |
| <img src="./src/assets/appsscript.png" height="20"/>          | appsscript   |
| <img src="./src/assets/GoogleDrive_2020.png" height="20"/>    | drive        |
| <img src="./src/assets/Sheets_2020.png" height="20"/>         | sheets       |
| <img src="./src/assets/Docs_2020.png" height="20"/>           | docs         |
| <img src="./src/assets/GoogleCalendar_2020.png" height="20"/> | calendar     |
| <img src="./src/assets/Gmail_2020.png" height="20"/>          | gmail        |
| <img src="./src/assets/Slides_2020.png" height="20"/>         | slides       |
| <img src="./src/assets/gcp.png" height="20"/>                 | gcp          |
