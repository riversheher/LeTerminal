# Le Terminal

A linux desktop, terminal inspired theme for use with Hugo.

A balance between the terminal system model, and features for user experience and readability.

## Key Features
- Autoscrolling text
- Swap between click based and text input based interfaces.
- Blog
- User defined categories
- Fully HUGO, no backend required.

## Key Design Considerations

- Ensure that the design is very easily identified as a terminal.
    - All content is within the confines of the terminal window.
- Support images within the terminal window without breaking the terminal model.
- Support paginated blog
- Markdown files used as content base, generated partials, and html
- Dynamically fetch content through HTMX without pageload
- Fetched content printed in terminal window, autoscrolled, history can be viewed by scrolling up.
- Homepage content persists after terminal clear command.

# Dependencies
- HTMX 2.0.8