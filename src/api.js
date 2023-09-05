import mockData from "./mock-data";

export const extractLocations = (events) => {
    const extractLocations = events.map((event) => event.location);
    const locations = [...new Set(extractLocations)];
    return locations;
};

const checkToken = async (accessToken) => {
    const response = await fetch(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`);
    const result = await response.json();
    return result;
};

export const getEvents = async () => {
    if (window.location.href.startsWith("http://localhost")) {
        return mockData;
    }

    // if (!navigator.online) {
    //     const events = localStorage.getItem("lastEvents");
    //     return events ? JSON.parse(events) : [];
    // }

    const token = await getAccessToken();

    if (token) {
        removeQuery();
        const url = "https://pmeaxtp8a5.execute-api.us-west-1.amazonaws.com/dev/api/get-events" + "/" + token;
        const response = await fetch(url);
        const result = await response.json();

        if (result) {
            // localStorage.setItem("lastEvents", JSON.stringify(result.data.items)); 
            return result.data.items;
        } else return null;
    }
};

const removeQuery = () => {
    let newurl;
    if (window.history.pushState && window.location.pathname) {
        newurl = window.location.protocol + "//" + window.location.host + window.location.pathname;
        window.history.pushState("", "", newurl);
    } else {
        newurl = window.location.protocol + "//" + window.location.host;
        window.history.pushState("", "", newurl);
    }
};

const getToken = async (code) => {
    const encodeCode = encodeURIComponent(code);
    const response = await fetch("https://pmeaxtp8a5.execute-api.us-west-1.amazonaws.com/dev/api/token" + "/" + encodeCode);
    const { access_token } = await response.json();

    access_token && localStorage.setItem("access_token", access_token);

    return access_token;
};

export const getAccessToken = async () => {

    const accessToken = localStorage.getItem("access_token");
    const tokenCheck = accessToken && (await checkToken(accessToken));

    if (!accessToken || tokenCheck.error) {
        await localStorage.removeItem("access_token");
        const searchParams = new URLSearchParams(window.location.search);
        const code = await searchParams.get("code");
        if (!code) {
            const response = await fetch("https://pmeaxtp8a5.execute-api.us-west-1.amazonaws.com/dev/api/get-auth-url");
            const result = await response.json();
            const { authUrl } = result;
            return (window.location.href = authUrl);
        }
        return code && getToken(code);
    }
    return accessToken;
};