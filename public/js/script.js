const socket = io();

console.log("working...");

if(navigator.geolocation){
    navigator.geolocation.watchPosition((position)=>{
        const {latitude,longitude}= position.coords;
        socket.emit("send-location",{latitude,longitude});
    },
    (error)=>{
        console.error(error);
    },
    {
        enableHighAccuracy:true,
        timeout:5000,
        maximumAge:0,
    }
);
}

const map = L.map("map").setView([0,0], 16);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map)

const markers = {};

socket.on("receive-location",(data)=>{

    const {id,latitude,longitude}=data;
    map.setView([latitude,longitude]);
   
    if(markers[id]){
        markers[id].setLatLang([latitude,longitude]);
    }else{
        markers[id]= L.marker([latitude,longitude]).addTo(map)
        .bindPopup('<img src="./images/avatar.svg" style="width:40px"/> User')
        .openPopup();
    }
});

socket.on("user-disconnected",(id)=>{

    if(markers[id]){
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});