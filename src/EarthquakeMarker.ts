/* Assignment 3: Earthquake Visualization
 * CSCI 4611, Fall 2022, University of Minnesota
 * Instructor: Evan Suma Rosenberg <suma@umn.edu>
 * License: Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
 */ 

import * as gfx from 'gophergfx'
import { Earth } from './Earth';
import { EarthquakeRecord } from './EarthquakeRecord';

export class EarthquakeMarker extends gfx.MeshInstance
{
    private static baseMesh: gfx.SphereMesh | null = null;

    public startTime : number;
    public duration : number;
    public magnitude : number;
    public mapPosition : gfx.Vector3;
    public globePosition : gfx.Vector3;

    constructor(mapPosition: gfx.Vector3, globePosition: gfx.Vector3, record: EarthquakeRecord, duration: number)
    {
        // If the static base mesh has not yet been created, then initialize it
        // if(!EarthquakeMarker.baseMesh){
            let alpha_radius = 0;
            const x = gfx.MathUtils.clamp(record.magnitude, 6.5, 7.5);
            alpha_radius = gfx.MathUtils.rescale(x, 6.5, 7.5, 0, 1)
            const y =gfx.MathUtils.lerp(0.02, 0.08, alpha_radius);
            
            EarthquakeMarker.baseMesh = new gfx.SphereMesh(y, 2);
        // }
        // Call the superclass constructor using the base mesh
        super(EarthquakeMarker.baseMesh);

        this.startTime = record.date.getTime();
        this.magnitude = record.normalizedMagnitude;
        this.duration = duration;
        this.mapPosition = mapPosition;
        this.globePosition = globePosition;

        // Set the position to the plane by default
        this.position.copy(this.mapPosition);
        
        
        // this.position.copy(this.globePosition);

        // Create a new material for this marker. The  color is set to gray by default,
        // so you will likely want to change it to a more meaningful value.
        this.material = new gfx.GouraudMaterial();
        const yello = new gfx.Color(1,1,0);
        const red = new gfx.Color(1,0,0);
        const quake_color = new gfx.Color(0,0,0);
        let alpha_color = 0;
        const z = gfx.MathUtils.clamp(record.magnitude, 6.5, 7.5);
        alpha_color = gfx.MathUtils.rescale(z, 6.5, 7.5, 0, 1)
        quake_color.lerp(yello, red, alpha_color)
        this.material.setColor(quake_color);
    }

    // This returns a number between 0 (start) and 1 (end)
    getPlaybackLife(currentTime: number) : number
    {
        return gfx.MathUtils.clamp(Math.abs(currentTime/1000 - this.startTime/1000) / this.duration, 0, 1);
    }
}