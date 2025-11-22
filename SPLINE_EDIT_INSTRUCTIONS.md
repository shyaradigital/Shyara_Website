# Instructions to Remove UI Elements from Spline Scene

Since the Spline scene is hosted remotely at `https://prod.spline.design/7Xyc-4Wtw5VI1PDk/scene.splinecode`, you need to edit it in the Spline editor to remove the UI buttons.

## Steps to Remove UI Elements:

1. **Open Spline Editor**
   - Go to https://spline.design
   - Log in to your account
   - Open the project that contains the robot scene

2. **Locate the UI Elements**
   - In the **Outliner** panel (left sidebar), look for:
     - Objects named "button", "Button", "Wanna connect", "connect", "UI", or similar
     - Text objects with "Wanna connect?" or "About Shyara" text
     - Any interactive elements or groups containing buttons

3. **Delete the UI Elements**
   - Select each button/UI element in the Outliner
   - Press `Delete` key or right-click → Delete
   - Make sure to delete:
     - The "Wanna connect?" button
     - Any "About Shyara" button (if it exists in the scene)
     - Any text objects related to these buttons
     - Any parent groups containing these elements

4. **Save and Publish**
   - Save your project (Ctrl+S / Cmd+S)
   - Click **Export** or **Publish** button
   - If the URL changes, update it in:
     - `frontend/src/pages/Home.js` (line ~480)
     - `frontend/src/pages/HomeNoLoading.js` (line ~383)
     - `frontend/index.html` (line 58)

5. **Verify**
   - The scene should now load without any UI buttons
   - Only the robot should be visible

## Alternative: Hide in Spline Editor

If you want to keep the elements but hide them:
- Select the UI elements
- In the Properties panel, toggle **Visible** to OFF
- This will hide them but keep them in the scene file

## Current Scene URL:
`https://prod.spline.design/7Xyc-4Wtw5VI1PDk/scene.splinecode`

