# 3D examples with three.js

[https://threejs.org](https://threejs.org)

##three.js vs. WebGL vs. an Engine

WebGL is a low-level interface for doing 3D. It's concerned with the most basic types of operations that can be done. For example, you can use it to draw a triangle. It will not do something as complex as loading a 3D model of car.

A full-blown game engine will include all kinds of library functions to ease 3D development. It also will include tooling for helping to build assets for the game. If you are writing a complete project, choose a good 3D engine. Web-based engines will use WebGL deep down for rendering.

three.js is a compromise. It takes away a lot of the boilerplate that's necessary with WebGL, and includes a lot of helpful functions for importing models, generating geometry, and so on. As such, it's a lightweight engine that's great for small demos and learning. (Or for bulding a full-blown engine on top of!)

## Examples
1. three-basic: ambient lighting (a 3D model of car)