import { 
    sphericalToCartesian, 
    distance3D, 
    roofFaceArea, 
    totalRoofArea,
    slopeAngle
} from '../modules/calculator.js';

function testCalculator() {
    console.log('--- Testing calculator.js ---');

    // Test case: 45 degree tilt, 0 bearing, 10m distance
    // x = 10 * cos(45) * cos(0) = 10 * 0.707 * 1 = 7.07
    // y = 10 * cos(45) * sin(0) = 10 * 0.707 * 0 = 0
    // z = 10 * sin(45) = 10 * 0.707 = 7.07
    const p1 = sphericalToCartesian(10, 45, 0);
    console.log('sphericalToCartesian(10, 45, 0):', p1);
    const expectedP1 = { x: 10 * Math.cos(45 * Math.PI / 180), y: 0, z: 10 * Math.sin(45 * Math.PI / 180) };
    if (Math.abs(p1.x - expectedP1.x) < 0.01) console.log('✅ P1 X Correct');
    if (Math.abs(p1.y - expectedP1.y) < 0.01) console.log('✅ P1 Y Correct');
    if (Math.abs(p1.z - expectedP1.z) < 0.01) console.log('✅ P1 Z Correct');

    // Test Roof Calculation
    // Point A (Bottom Left): 5m distance, 0 tilt, 0 bearing
    const A = sphericalToCartesian(5, 0, 0); 
    // Point C (Bottom Right): 5m distance, 0 tilt, 90 bearing
    const C = sphericalToCartesian(5, 0, 90); 
    // Point B (Top Left): 10m distance, 45 tilt, 0 bearing
    const B = sphericalToCartesian(10, 45, 0); 
    // Point D (Top Right): 10m distance, 45 tilt, 90 bearing
    const D = sphericalToCartesian(10, 45, 90);

    console.log('Points:', { A, B, C, D });

    const result = roofFaceArea(A, B, C, D);
    console.log('roofFaceArea Result:', result);
    
    // Manual verification of expected area:
    // eaveLength (A to C): sqrt( (5*cos(0)*cos(90) - 5*cos(0)*cos(0))^2 + (5*cos(0)*sin(90) - 5*cos(0)*sin(0))^2 )
    // = sqrt( (0 - 5)^2 + (5 - 0)^2 ) = sqrt(25 + 25) = 7.07m
    // ridgeLength (B to D): same logic but with 10m and 45deg
    // = sqrt( (10*cos(45)*0 - 10*cos(45)*1)^2 + (10*cos(45)*1 - 10*cos(45)*0)^2 )
    // = sqrt( (-10*0.707)^2 + (10*0.707)^2 ) = sqrt(50 + 50) = 10m
    // area = ((7.07 + 10) / 2) * rafter
    // rafter = dist(A, B) = sqrt( (7.07 - 5)^2 + (0-0)^2 + (7.07 - 0)^2 )
    // = sqrt( 2.07^2 + 7.07^2 ) = sqrt(4.28 + 50) = 7.37m
    // area = (17.07 / 2) * 7.37 = 8.535 * 7.37 = 62.9 m2
    
    if (result.trueArea > 60 && result.trueArea < 65) {
        console.log('✅ Roof Area Logic is plausible');
    } else {
        console.log('❌ Roof Area Logic failed check');
    }

    console.log('--- Calculator Test Complete ---');
}

testCalculator();
