# Techytimms

A personal website for James Timms. A modern, interactive terminal-based website that serves as both a showcase of my skills and an engaging experience for visitors. The website simulates a command-line interface where users can type commands to navigate my portfolio, view my projects, and learn about my experience.

## Todo

### Core

- Set up project

  - [x] Create new Vite project with React and TypeScript using pnpm
  - [x] Install dependencies (xterm, styled-components)
  - [ ] Configure ESLint and Prettier

- Create basic Terminal UI

  - [ ] Implement main Terminal component
  - [ ] Add command input handling
  - [ ] Create command history storage
  - [ ] Style terminal appearance (dark background, colored text)
  - [ ] Ensure terminal output displays correctly

- Build command handling system

  - [ ] Design command registry/handler architecture
  - [ ] Implement parser for commands and arguments
  - [ ] Create error handling for unknown commands
  - [ ] Add welcome message on first load
  - [ ] Make terminal state persist between page reloads

- Implement navigation functionality

  - [ ] Add command history navigation (up/down arrows)
  - [ ] Implement tab completion for commands
  - [ ] Create command suggestions for errors

- Add core content commands

  - [ ] `help`: Display available commands
  - [ ] `about`: Show personal introduction
  - [ ] `skills`: List technical skills and proficiencies
  - [ ] `experience`: Display work history and roles
  - [ ] `projects`: Showcase portfolio projects
  - [ ] `contact`: Show contact information
  - [ ] `clear`: Clear terminal screen
  - [ ] `resume`: View/download CV

- Create interactive enhancements

  - [ ] Add typing animation effect for responses
  - [ ] Implement simple file system navigation (`ls`, `cd`)
  - [ ] Create 1-2 easter egg commands
  - [ ] Add syntax highlighting for code examples
  - [ ] Implement cursor animation and blinking

- Develop visual improvements

  - [ ] Design terminal header with custom styling
  - [ ] Create loading animations for longer commands
  - [ ] Add custom prompt styling
  - [ ] Include simple ASCII art for visual enhancement
  - [ ] Polish overall terminal appearance (fonts, colors, spacing)

- Optimize for different devices

  - [ ] Add mobile responsiveness
  - [ ] Ensure consistent styling across browsers
  - [ ] Fix any scrolling or layout issues
  - [ ] Test on multiple devices and screen sizes

- Prepare for deployment

  - [ ] Add proper meta tags for SEO
  - [ ] Create favicon and site icons
  - [ ] Implement basic analytics tracking
  - [ ] Ensure accessibility for keyboard navigation
  - [ ] Optimize bundle size and loading performance

### Future Enhancements

- [ ] LLM-powered Q&A capabilities
- [ ] Theme switcher command
- [ ] Visual mode toggle for non-technical visitors
- [ ] Blog integration
- [ ] Mini-games or interactive demos
