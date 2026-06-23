export async function fetchStravaBeacon(beaconId) {
  try {
    const response = await fetch(`/api/beacon/${beaconId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const html = await response.text();
    
    // Extract the initialActivity JSON from the script block
    // We look for: var initialActivity = {...};
    const match = html.match(/var initialActivity = ({.*?});/s);
    
    if (match && match[1]) {
      const data = JSON.parse(match[1]);
      return data;
    } else {
      throw new Error("Could not parse beacon data from HTML");
    }
  } catch (error) {
    console.error("Error fetching Strava Beacon data:", error);
    return null;
  }
}
