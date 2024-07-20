/* Assignment 3: Earthquake Visualization
 * CSCI 4611, Fall 2022, University of Minnesota
 * Instructor: Evan Suma Rosenberg <suma@umn.edu>
 * License: Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
 */ 

import * as gfx from 'gophergfx'
import { Vector3 } from 'gophergfx';
import { EarthquakeMarker } from './EarthquakeMarker';
import { EarthquakeRecord } from './EarthquakeRecord';

export class Earth extends gfx.Transform3
{
    private earthMesh: gfx.Mesh;
    private earthMaterial: gfx.MorphMaterial;

    public globeMode: boolean;
    public naturalRotation: gfx.Quaternion;
    public mouseRotation: gfx.Quaternion;

    constructor()
    {
        // Call the superclass constructor
        super();

        this.earthMesh = new gfx.Mesh();
        this.earthMaterial = new gfx.MorphMaterial();

        this.globeMode = false;
        this.naturalRotation = new gfx.Quaternion();
        this.mouseRotation = new gfx.Quaternion();
    }

    public createMesh() : void
    {
        // Initialize texture: you can change to a lower-res texture here if needed
        // Note that this won't display properly until you assign texture coordinates to the mesh
        this.earthMaterial.texture = new gfx.Texture('./assets/earth-2k.png');
        
        // This disables mipmapping, which makes the texture appear sharper
        this.earthMaterial.texture.setMinFilter(true, false);

        // 20x20 is reasonable for a good looking sphere
        // 150x150 is better for height mapping
        // const meshResolution = 20;     
        const meshResolution = 150;

        // A rotation about the Z axis is the earth's axial tilt
        this.naturalRotation.setRotationZ(-23.4 * Math.PI / 180); 
        
        // Precalculated vertices, normals, and triangle indices.
        // After we compute them, we can store them directly in the earthMesh,
        // so they don't need to be member variables.
        const mapVertices: number[] = [];
        const mapNormals: number[] = [];
        const indices: number[] = [];
        const uvs: number[] = [];
        const globeVertices: number[] = [];
        const globeNormals: number[] = [];

        const numVerticesX = meshResolution + 1;
        const unit_lon = (180 * 2) / meshResolution;
        const unit_lat = 180 / meshResolution;

        
        
        // As a demo, we'll add a square with 2 triangles.
        // First, we define four vertices
        // The normals are always directly outward towards the camera

        for(let i=0; i < numVerticesX; i++)
        {
            for(let j=0; j < numVerticesX; j++){
                const cur_pos = this.convertLatLongToPlane(-90 + j*unit_lat, -180 + i*unit_lon);
                mapVertices.push(cur_pos.x, cur_pos.y, cur_pos.z);
                mapNormals.push(0,0,1);
                uvs.push(i / meshResolution, 1 - j / meshResolution);

            }
        }

        for(let i=0; i < numVerticesX; i++)
        {
            for(let j=0; j < numVerticesX; j++){
                const cur_pos = this.convertLatLongToSphere(-90 + j*unit_lat, -180 + i*unit_lon);
                globeVertices.push(cur_pos.x, cur_pos.y, cur_pos.z);
                globeNormals.push(cur_pos.x, cur_pos.y, cur_pos.z);

            }
        }

        // Next we define indices into the array for the two triangles
        for(let i=0; i < meshResolution; i++)
        {
            for(let j=0; j < meshResolution; j++){
                indices.push(i*numVerticesX+j,(i+1)*numVerticesX+j, i*numVerticesX+j+1);
                indices.push((i+1)*numVerticesX+j,(i+1)*numVerticesX+j+1, i*numVerticesX+j+1);
            }
        }

        // Set all the earth mesh data
        this.earthMesh.setVertices(mapVertices, true);
        this.earthMesh.setNormals(mapNormals, true);
        this.earthMesh.setMorphTargetVertices(globeVertices, true);
        this.earthMesh.setMorphTargetNormals(globeNormals, true);
        this.earthMesh.setIndices(indices);
        this.earthMesh.setTextureCoordinates(uvs);
        this.earthMesh.createDefaultVertexColors();
        this.earthMesh.material = this.earthMaterial;

        // Add the mesh to this group
        this.add(this.earthMesh);
    }

    // TO DO: add animations for mesh morphing
    public update(deltaTime: number) : void
    {
        // TO DO
        if (this.globeMode){
            
            this.earthMaterial.morphAlpha += deltaTime;
            this.earthMaterial.morphAlpha = gfx.MathUtils.clamp(this.earthMaterial.morphAlpha, 0, 1);
            this.children.forEach((quake: gfx.Transform3) => {
                if(quake instanceof EarthquakeMarker){
                    quake.position.lerp(quake.mapPosition, quake.globePosition, this.earthMaterial.morphAlpha);
                }
            });
            
        }
        else{
            this.rotation.set(0,0,0,1);
            this.earthMaterial.morphAlpha -= deltaTime;
            this.earthMaterial.morphAlpha = gfx.MathUtils.clamp(this.earthMaterial.morphAlpha, 0, 1);
           
            this.children.forEach((quake: gfx.Transform3) => {
                if(quake instanceof EarthquakeMarker){
                    quake.position.lerp(quake.mapPosition, quake.globePosition, this.earthMaterial.morphAlpha);
                }
            });
        }


        
    }

    
    // public rotatenatural(deltaTime: number){
    //     this.earthMesh
    // }
    // rotate(rotation: Vector3): void
    // {
    //     this.rotation.multiply(this.naturalRotation.makeEulerAngles(rotation.x, rotation.y, rotation.z));
    // }

    public createEarthquake(record: EarthquakeRecord, normalizedMagnitude : number)
    {
        // Number of milliseconds in 1 year (approx.)
        const duration = 12 * 28 * 24 * 60 * 60;

        // TO DO: currently, the earthquake is just placed randomly on the plane
        // You will need to update this code to calculate both the map and globe positions
        // const mapPosition = new gfx.Vector3(Math.random()*6-3, Math.random()*4-2, 0);
        const mapPosition = this.convertLatLongToPlane(record.latitude, record.longitude);
        const globePosition = this.convertLatLongToSphere(record.latitude, record.longitude);
        const earthquake = new EarthquakeMarker(mapPosition, globePosition, record, duration);


        // Initially, the color is set to yellow.
        // You should update this to be more a meaningful representation of the data.
        const yello = new gfx.Color(1,1,0);
        const red = new gfx.Color(1,0,0);
        const quake_color = new gfx.Color(0,0,0);
        let alpha_color = 0;
        const x = gfx.MathUtils.clamp(record.magnitude, 6.5, 7.5);
        alpha_color = gfx.MathUtils.rescale(x, 6.5, 7.5, 0, 1)
        quake_color.lerp(yello, red, alpha_color)
        earthquake.material.setColor(quake_color);

        this.add(earthquake);
    }

    public animateEarthquakes(currentTime : number)
    {
        // This code removes earthquake markers after their life has expired
        this.children.forEach((quake: gfx.Transform3) => {
            if(quake instanceof EarthquakeMarker)
            {
                const playbackLife = (quake as EarthquakeMarker).getPlaybackLife(currentTime);
                if(playbackLife >= 1)
                {
                    quake.remove();
                    // this.children.
                }
                else
                {
                    // Global adjustment to reduce the size. You should probably update this be a
                    // more meaningful representation of the earthquake's lifespan.
                    quake.scale.set(1-playbackLife, 1-playbackLife, 1-playbackLife);
                }
            }
        });
    }

    public convertLatLongToSphere(latitude: number, longitude: number) : gfx.Vector3
    {
        // TO DO: We recommend filling in this function to put all your
        // lat,long --> plane calculations in one place.
        const lat = latitude * Math.PI / 180;
        const lon = longitude * Math.PI / 180;
        const x = Math.cos(lat) * Math.sin(lon);
        const y = Math.sin(lat);
        const z = Math.cos(lat) * Math.cos(lon);

        return new gfx.Vector3(x, y, z);
    }

    public convertLatLongToPlane(latitude: number, longitude: number) : gfx.Vector3
    {
        // TO DO: We recommend filling in this function to put all your
        // lat,long --> plane calculations in one place.
        const x = longitude * Math.PI/180;
        const y = latitude * Math.PI/180;

        return new gfx.Vector3(x, y, 0);
    }

    // This function toggles the wireframe debug mode on and off
    public toggleDebugMode(debugMode : boolean)
    {
        this.earthMaterial.wireframe = debugMode;
    }
}