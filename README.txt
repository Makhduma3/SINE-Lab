SINE Lab website
Security, Intelligence, Networks & Edge · Trent University Durham GTA
=====================================================================

HOW TO OPEN
  Double-click index.html. It opens in any web browser.
  An internet connection is only needed for the fonts.

FOLDER
  index.html            all page content (text, team, gallery)
  css/style.css         colours, fonts and layout
  js/main.js            mobile menu, scroll effects, network node details, photo viewer
  js/beetle.js          the yellow beetle, its draggable house and the beetle cursor
  images/logo-shield.svg  MAIN LOGO: the shield emblem, used in the header and footer (also .png)
  images/logo-shield-icon.svg  simplified shield (S only): browser tab icon and phone icon (also .png)
  images/logo-header.svg  alternative wordmark (S + INE + LAB), not used on the page
  images/logo.svg       full wordmark with tagline, for light backgrounds (also logo.png)
  images/logo-dark.svg  full wordmark with tagline, for dark backgrounds (used in the footer)
  images/logo-badge.svg dark badge version for slides, posters and social media (also .png)
  images/logo-mark.svg  the "S" icon alone: browser tab icon and profile picture (also .png)
  images/logo-options/  alternative designs (shield original and hexagon)
  images/gallery/       lab photos
  images/team/          team headshots (placeholder.svg until photos are added)

ADD A TEAM PHOTO
  1. Save a square photo (at least 400 x 400 px) in images/team/, e.g. images/team/elma-mahbub.jpg
  2. In index.html, find that person's card and change
       src="images/team/placeholder.svg"   to   src="images/team/elma-mahbub.jpg"
  3. Fill in any [Research focus], [Name] or [Role] placeholders.

ADD A GALLERY PHOTO
  1. Copy it into images/gallery/ (about 1600 px on the long side is plenty).
  2. In index.html, copy one <li> ... </li> line in the Gallery section, change the
     image file, the alt text and the caption, and set data-index to the next number.
  3. Add class="g-wide" to the <li> for a landscape photo that should span two columns.

PUTTING IT ONLINE
  Plain HTML, CSS and JavaScript: no server, database, login or forms.
  Upload the whole folder, keeping css, js and images next to index.html.

THE BEETLE
  A yellow beetle wanders the page and runs from the cursor; after a while it walks home to
  rest. Drag its house anywhere (the position is remembered). The beetle button in the header
  sends it home or lets it out. It is hidden for visitors who turn on 'reduce motion'.

CONTENT NOTES
  - Testbed facts (30 devices, groups, timings, privacy, limitations) follow the
    "Testbed Execution" document. Update them if the testbed changes.
  - The site states that the testbed currently collects normal-operation data and
    that controlled attack scenarios are planned. Change this once attacks are running.
  - The hero network (clusters, aggregator, edge server, labelled data) is drawn in
    index.html; the text shown when a node is tapped is in js/main.js (NODES).
