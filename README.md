# Portfolio 2

A modern, backend-focused portfolio site for Md. Fazle Rabbi Rithik.

## 📸 Add your photo
1. Drop your image into `portfolio2/` (e.g., `profile.jpg`).
2. Replace the placeholder inside `index.html`:
   ```html
   <div class="image-placeholder">
     <p>Your Photo</p>
   </div>
   ```
   with:
   ```html
   <img src="profile.jpg" alt="Md. Fazle Rabbi Rithik" class="profile-photo" />
   ```
3. Add styling in `style.css` if needed (the placeholder is already sized).

## ▶️ Run locally
Open `index.html` directly in a browser, or serve the folder with a simple static server.

```bash
python3 -m http.server --directory /home/rithik/coding/portfolio2 8000
```

Then visit `http://localhost:8000`.

## 🚀 Deploy
This project is a static site. You can deploy it with Netlify or Vercel. The config files are already included in `portfolio2/`.

### Netlify (recommended)
1. Push the repo to GitHub.
2. In Netlify, choose **New site from Git**.
3. Set the **Base directory** to `portfolio2`.
4. Set **Build command** to empty.
5. Set **Publish directory** to `.`.

### Vercel
1. Push the repo to GitHub.
2. In Vercel, import the repo.
3. Set the **Root Directory** to `portfolio2`.
4. Framework preset: **Other**.
5. Deploy.

## ✨ Customize
- Update content in `index.html` (sections: About, Expertise, Tech Stack, Projects).
- Tweak colors and layout in `style.css`.
- Update typing strings in `script.js`.
