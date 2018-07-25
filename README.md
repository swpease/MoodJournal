# MoodJournal
Journal / diary web app allowing categorized entries and mood ratings. 

### Purpose
I am a proponent of maintaining a journal / diary for reflection and such, but it can be difficult to find what you are looking for when trying to reflect on the past. This [website](https://www.categoricaljournal.com/) was built to enable people to easily search through their entries history to find forgotten thoughts.

### Technology
* *Backend*: Django REST Framework
* *Frontend*: React (with material-ui)
* *Testing*: Jest, Enzyme

DRF is well-constructed, but I found tertiary packages (e.g. django-rest-auth) to be a headache. I initially tried to follow JSON API, but was suspicious of the quality of the package I found, and abandoned it.
