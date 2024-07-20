# Earthquake Visualization

This project is an interactive visualization of global earthquake data, implemented as part of a computer graphics course (CSCI 4611) at the University of Minnesota. It demonstrates skills in 3D graphics programming, geospatial data visualization, and interactive application development.

## Features

- Visualization of earthquake data from 1905 to 2007 on both a 2D map and 3D globe
- Smooth morphing between 2D and 3D views
- Dynamic rendering of earthquake markers based on magnitude and time
- Texture mapping of Earth's surface
- Custom shading for realistic globe appearance

## Technologies Used

- TypeScript
- WebGL
- GopherGfx (custom graphics library)

## Implementation Highlights

- Created a deformable 3D mesh for the Earth's surface
- Implemented conversion between spherical (latitude/longitude) and Cartesian coordinates
- Applied textures to the 3D globe
- Developed custom shaders for lighting and visual effects
- Optimized performance for smooth animation and interactivity

## Bonus Features

1. Animated earthquake markers with size and color based on magnitude
2. Interactive globe rotation controlled by mouse movement
3. Zoom functionality using the mouse wheel

## Screenshot

![Screenshot](https://github.com/MilkTaro798/Earthquake-Visualization/blob/main/screenshot1.png)
![Screenshot](https://github.com/MilkTaro798/Earthquake-Visualization/blob/main/screenshot2.png)

## Running the Project

To run this project locally:

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run start`
4. Open `http://localhost:8080` in your web browser

## Acknowledgments

This project was completed as an assignment for CSCI 4611 at the University of Minnesota. The original assignment was designed by Prof. Evan Suma Rosenberg, based on content from Prof. Daniel Keefe.

## License

This project is licensed under the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.