# Lofi Music & GIF Player

A simple web-based music player that streams **Lofi music from YouTube** in the background while displaying a **selected GIF in the foreground**. Perfect for creating a relaxing, focused ambiance.

---

## Features

- Plays a YouTube Lofi stream **muted initially**, then unmutes after user interaction (handles autoplay restrictions)
- Background music continues seamlessly while the GIF animates in the foreground
- Clean, minimal interface with no distracting controls
- Works across modern browsers

---

## Demo

Check out the project live here: [Lofi Hub](https://lofi-hub.netlify.app/)

---

## How It Works

- **YouTube Music:**  
  The player embeds a YouTube Lofi stream using an `<iframe>`. Due to browser autoplay restrictions, the music starts muted and is unmuted after the user interacts with the page (e.g., clicks anywhere).
- **GIF Display:**  
  A GIF is displayed in the foreground using a standard `<img>` tag. You can easily swap out the GIF for your own.

---

## Customization

- **Change the GIF:**  
  Replace the file at `assets/your_gif.gif` with your preferred GIF, or update the image path in `index.html`.

- **Change the YouTube Stream:**  
  Edit the YouTube embed URL in `index.html` to use your favorite Lofi stream.

---

## Project To-Do List

### Features

- [x] Play Lofi music from YouTube
- [x] GIF animation in the foreground
- [x] Autoplay works seamlessly across browsers
- [x] Mute/unmute after user interaction
- [x] Customizable GIF selection

### Improvements

- [x] Add volume control
- [x] Add play/pause button for music
- [x] Support multiple GIFs
- [x] Add shuffle functionality 
- [x] Mobile responsiveness
- [x] Add features for mobile view
- [x] work on stability of the music and gif
- [x] Imporve the UI

### Deployment

- [x] Host on Netlifly
- [ ] Add proper README with demo GIF
- [ ] License selection and addition

### Testing

- [x] Test on Chrome, Firefox, Edge
- [x] Test autoplay behavior
- [x] Test GIF display across resolutions

---

## Credits

- Lofi music streams provided by YouTube channels such as [Lofi Girl](https://www.youtube.com/c/LofiGirl)
- GIFs from [GIPHY](https://giphy.com/) or your own collection
