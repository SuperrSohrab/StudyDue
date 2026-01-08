# StudyDue

Chrome new tab extension for tracking study projects with due dates.
Created by Sohrab. Licensed under the MIT License.

You may copy, modify, and redistribute this extension. Use it at your own risk; the creator assumes no liability for any outcome.

## Features
- New tab override showing greeting and current time
- Add projects with due dates; stored in localStorage
- Sorted project list with inline edit/delete
- Random motivational search placeholders

## Install (unpacked)
1. Open `chrome://extensions/` and toggle **Developer mode**.
2. Click **Load unpacked** and select this folder.
3. Activate StudyDue from between your extensions
4. Open a new tab to use StudyDue.

## Usage
- Click **Add your project**, enter a name and due date, then save.
- Hover a project to edit or delete it.
- Entries persist locally via localStorage.

## Assets
- Icon: `images/studydue.png`
- Background and other assets live in `images/`.

## Development
- Edit UI: `newtab.html`, `newtab.css`, `newtab.js`.
- Manifest: `manifest.json` (MV3, new tab override).
- No build step; changes take effect after reloading the unpacked extension.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
