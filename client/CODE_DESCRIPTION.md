# React + React-Bootstrap Client Code Walkthrough

This document explains every module and block of the single-page application
that accompanies the Express + MongoDB Todo backend. Each section is organised
by file path and provides a concise description of the responsibility for every
import, variable, function, and JSX fragment.

## `package.json`
- Declares the package metadata (`name`, `version`, `private`) so the client can
  be installed with `npm` without being published.
- `description` summarises the intent of the module for maintainers.
- `scripts` expose Vite development, build, preview, lint, and format commands;
  `npm run format` leverages Prettier to keep JS/JSX/CSS consistent.
- `dependencies` lists runtime libraries required by the SPA:
  - `bootstrap` supplies the CSS framework consumed by React-Bootstrap.
  - `react` and `react-dom` deliver the core rendering primitives.
  - `react-bootstrap` provides ready-to-use Bootstrap components.
  - `react-router-dom` handles client-side routing between login, register, and
    dashboard screens.
- `devDependencies` contains tooling needed when developing locally, including
  TypeScript type definitions, Vite, linting plugins, and Prettier for
  formatting.

## `vite.config.js`
- Imports `defineConfig` from Vite to create a strongly typed configuration
  object.
- Imports the official React plugin for Vite so JSX and fast refresh work out of
  the box.
- Exports the configuration with:
  - `plugins: [react()]` enabling React support.
  - `server.proxy` forwarding `/api` requests to the Express backend during
    development, avoiding CORS issues while keeping the production build static.

## `public/index.html`
- Declares the HTML shell used by Vite during development and production.
- Injects the root element (`<div id="root" />`) where the React tree mounts.
- Loads the JavaScript entry module (`/src/main.jsx`) via `<script type="module">`.

## `src/main.jsx`
- Imports React and the DOM renderer entry points.
- Imports the root `App` component and the `AuthProvider` context wrapper.
- Pulls in Bootstrap's base stylesheet alongside the custom theme/animation CSS
  so visual styles load before React renders any component.
- Calls `ReactDOM.createRoot` to mount the application into the `#root` element
  defined in `index.html`.
- Wraps `<App />` inside `<AuthProvider>` so authentication state is available
  throughout the component tree.
- Wraps everything in `<React.StrictMode>` to opt into React's development
  checks.

## `src/context/AuthContext.jsx`
- Imports React helpers to construct a context (`createContext`), read it
  (`useContext`), memoise values (`useMemo`), and store state (`useState`).
- Creates the `AuthContext` object that will hold authentication information.
- `AuthProvider` component:
  - Uses `useState` to keep track of the current user object.
  - Builds the context value with `useMemo`, exposing `user`, `login`, and
    `logout` callbacks; memoisation ensures consumers only re-render when the
    `user` reference changes.
  - Returns the provider element so descendant components gain access to the
    authentication utilities.
- `useAuth` hook:
  - Reads the nearest `AuthContext` provider.
  - Throws an explicit error if used outside the provider to catch misuse early.
  - Returns the context value for convenience.

## `src/api.js`
- Defines shared JSON headers used by every API call.
- `request` helper performs a `fetch` with credentials, merges any custom
  headers, and propagates the caller-provided options.
- Parses JSON responses when the server indicates a JSON payload.
- Throws a JavaScript `Error` when the HTTP status is not OK, preferring server
  messages when available.
- Exposes specific API functions (`login`, `register`, `logout`, `getCurrentUser`,
  `listTodos`, `createTodo`, `toggleTodo`, `removeTodo`) that call `request` with
  the appropriate HTTP method, path, and body.

## `src/App.jsx`
- Imports React state/effect utilities plus `useMemo` for memoised route
  definitions, React Router primitives, and React-Bootstrap layout elements.
- Pulls the `useAuth` hook to access authentication data.
- Imports `AuthForms`, `TodoDashboard`, the `RegisterPage`, and API helpers for
  session management.
- `AppShell` component:
  - Provides a consistent layout containing the navbar (with animated link
    underline), optional status messages (`<Alert>` with dismiss handler), and
    a floating spinner while the app bootstraps.
  - Receives `onLogout`, `isLoading`, `statusMessage`, `onDismissStatus`,
    `showLogout`, and `children` so `App` can orchestrate UI transitions and
    hide the logout link for anonymous visitors.
- `App` component:
  - Extracts `user`, `login`, and `logout` from the authentication context.
  - Manages `bootstrapping` (initial loading state) and `statusMessage` for global
    feedback.
  - Runs an effect on mount to restore the session by calling `getCurrentUser`;
    on success the user is stored, on failure an error alert is shown, and the
    loading spinner stops regardless of outcome.
  - Declares `handleLogout` to call the API, clear the context, and show a success
    or error message accordingly.
  - Memoises the `<Routes>` tree with `useMemo` so re-renders only happen when
    authentication data changes.
  - Routes mirror the server flow: `/login`, `/register`, `/todos`, and a
    catch-all redirect that falls back to the appropriate screen.

## `src/components/AuthForms.jsx`
- Imports React hooks (`useState`, `useMemo`), React Router navigation helper, and
  React-Bootstrap form components.
- Uses API helpers to send login or registration requests.
- Maintains local form state (`formState`), submission state (`submitting`), and
  error feedback (`error`).
- `handleChange` updates the relevant field when the user types.
- `handleSubmit` prevents the default form submission, toggles the loading state,
  calls either `registerRequest` or `loginRequest`, and then notifies the parent
  via `onLogin` before navigating to `/todos`; errors are surfaced in an alert.
- `submitLabel` derives the main button text with `useMemo`, switching between
  “Invio in corso…”, “Registrati”, and “Accedi”.
- Renders a card enhanced with animation classes, conditional fields, and button
  labels depending on whether the component operates in login or registration
  mode.
- Provides a secondary animated link button that toggles between the login and
  registration routes.

## `src/components/TodoDashboard.jsx`
- Imports React state/effect hooks, `useMemo` for derived values, and
  React-Bootstrap components for layout, forms, placeholders, and lists.
- Loads helper functions to interact with the todo API endpoints.
- Tracks `todos`, the new todo input text (`newTodo`), loading state, and error
  messages.
- `useEffect` loads the initial todo list on mount, updating state accordingly
  and handling failures.
- `handleAddTodo` submits a new todo when the form is valid, appending the
  created todo from the API response and clearing the input box.
- `handleToggle` flips the completion state by calling the toggle API and
  updating the local array.
- `handleDelete` removes the todo both on the server and locally when deletion
  succeeds.
- `hasTodos` memoises the presence of todos to drive the empty state.
- Renders a card with animated badges, glowing input, raised buttons, error
  shake animation, skeleton placeholders during loading, and a list group whose
  items animate on hover/completion; the empty state appears when there are no
  todos.

## `src/pages/RegisterPage.jsx`
- Imports React along with Bootstrap card and list components to compose the
  layout.
- Uses `AuthForms` in registration mode to reuse validation and submission
  logic.
- Wraps the form with an introductory card styled with the shared animation
  classes that highlights the benefits and passaggi principali della
  registrazione, aiutando gli utenti a capire cosa aspettarsi prima di
  compilare i campi.

## `src/styles/theme.css`
- Declares CSS custom properties, gradients, and shared shadow styles used by the
  SPA.
- Provides utility classes for animated fades, shakes, floating spinner, glowing
  inputs, raised buttons, and navbar underline transitions.
- Styles todo list items with subtle hover/completion feedback and resets list
  item borders to let the shadows stand out.
