# Thumbnail Dashboard Angular Project

This project is an Angular application that displays a responsive grid layout of dashboards. Each dashboard shows its ID and name, and renders various components based on a predefined JSON data structure.

## Project Structure

The project is organized as follows:

```
thumbnail-dashboard-angular
├── angular.json          # Angular CLI configuration
├── package.json          # npm dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── tslint.json           # TSLint configuration
├── README.md             # Project documentation
└── src
    ├── main.ts          # Entry point of the application
    ├── index.html       # Main HTML template
    ├── styles.scss      # Global styles
    ├── polyfills.ts     # Polyfills for browser compatibility
    ├── assets            # Static assets (images, fonts, etc.)
    ├── environments      # Environment-specific settings
    │   ├── environment.ts
    │   └── environment.prod.ts
    └── app
        ├── app.component.ts          # Root component logic
        ├── app.component.html         # Root component template
        ├── app.component.scss         # Root component styles
        ├── app.module.ts              # Root module definition
        ├── app-routing.module.ts      # Application routing
        ├── models
        │   └── dashboard.model.ts     # Dashboard model definition
        └── thumbnail-dashboard
            ├── thumbnail-dashboard.component.ts  # ThumbnailDashboardComponent logic
            ├── thumbnail-dashboard.component.html # ThumbnailDashboardComponent template
            ├── thumbnail-dashboard.component.scss # ThumbnailDashboardComponent styles
            └── thumbnail.class.ts      # Thumbnail class for rendering components
```

## Getting Started

To get started with the project, follow these steps:

1. **Clone the repository:**
   ```
   git clone <repository-url>
   cd thumbnail-dashboard-angular
   ```

2. **Install dependencies:**
   ```
   npm install
   ```

3. **Run the application:**
   ```
   ng serve
   ```

4. **Open your browser and navigate to:**
   ```
   http://localhost:4200
   ```

## Features

- Responsive grid layout for displaying dashboards.
- Dynamic rendering of dashboard components based on JSON data.
- Modular architecture with separate components and services.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.