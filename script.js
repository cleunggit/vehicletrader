const app = {};

app.init = () => {
    console.log('ready');
    app.getAllVehicles()
    app.getSelectValue()
    app.getSelectModel()
};

$(function () {
    // document ready
    app.init();
    $('.searchBtn').on('click', function(e) {
        e.preventDefault()
        app.getSelectedVehicle(app.allVehicles)
    })
});

// variables
app.allVehicles = []
app.manufacturers = []
app.vehicleClasses = []
app.makeSelected = ''
app.modelSelected = ''
app.priceSelected = ''

// get all vehicles on each page
app.getVehicleFromPageNum = (pageNum) => {
    const vehicles = $.ajax({
        url: `https://swapi.dev/api/vehicles/?page=${pageNum}`,
        method: 'GET',
        dataType: 'json',
    });
    // console.log(vehicles);
    return vehicles;
}

// get vehicles from all pages
app.getAllVehicles = () => {
    for (let i = 1; i <= 4; i++) {
        app.getVehicleFromPageNum(i).then(res => {
            // console.log(res.results);
            res.results.forEach(vehicle => {
                app.allVehicles.push(vehicle)
            })

            res.results.forEach(vehicle => {
                app.manufacturers.push(vehicle.manufacturer)
            })

            res.results.forEach(vehicle => {
                app.vehicleClasses.push(vehicle.vehicle_class)
            })

            app.renderManufacturers(app.manufacturers)
        })
    }
}

app.getVehicles = () => {
    // declare an array to store the responses
    // declare a page counter variable
    // iterate through all the pages
    for (let page = 1; page <= 4; page++) {
        // for each page make the ajax call/
        $.ajax({
            url: `https://swapi.dev/api/vehicles/?page=${page}`,
            method: 'GET',
            dataType: 'json',
        }).done(res => {
            // when it's done fetching store the res in an array
            res.results.forEach(vehicle => {
                app.allVehicles.push(vehicle)
            })

            res.results.forEach(vehicle => {
                app.manufacturers.push(vehicle.manufacturer)
            })

            res.results.forEach(vehicle => {
                app.vehicleClasses.push(vehicle.vehicle_class)
            })

            app.renderManufacturers(app.manufacturers)
        })
    }
}

// remove duplicates and populate dropdown with manufacturers
app.renderManufacturers = (manufacturers) => {
    const unique = [...new Set(manufacturers)].sort()
    $('#make').empty();
    $('#make').append(`<option class="make" value="">Any Make</option>`)
    unique.forEach(make => {
        $('#make').append(`<option class="make" value="">${make}</option>`)
    })
    console.log('Rendered');
}

// filter by manufacturer
app.filterByManufacturer = (vehicles, make) => {
    // when the user selects a make
    // iterate through the vehicles
    const filtered = vehicles.filter(vehicle => {
        // if the manufacturer is found return the vehicle
        return vehicle.manufacturer === make
    })
    app.renderModels(filtered)
}

// render model select dropdown
app.renderModels = (vehicles) => {
    $('#models').append(`<option value="">Any Model</option>`)
    vehicles.forEach(model => {
        $('#models').append(`<option class="model" value="">${model.name}</option>`)
    })
    // console.log('Rendered');
}

// get value from dropdown
app.getSelectValue = function() {
    $('form').on('change', '.make', function(){
        $('#models').empty(); // clear previous render
        let selection = $(this).find("option:selected").text()
        app.makeSelected = selection
        console.log(selection);
        app.filterByManufacturer(app.allVehicles, selection)
    })
}

app.getSelectModel = function() {
    $('form').on('change', '.model', function() {
        let selection = $(this).find("option:selected").text()
        console.log('selected');
        app.modelSelected = selection
        console.log((selection));
    })
}

app.getSelectedVehicle = (vehicle) => {
    // const selected = vehicles.filter(vehicle => {
    //     return vehicle.model === app.modelSelected
    // })
    $('.description').empty()
    for (let i = 0; i < app.allVehicles.length; i++) {
        if (app.allVehicles[i].model === app.modelSelected) {
            console.log(app.allVehicles[i]);
            $('.description').append(`
                <h3>${app.allVehicles[i].name}</h3>
                <p>
                <span>Manufacturer: ${app.allVehicles[i].manufacturer}</span>
                <br>
                <span>Cost: ${app.allVehicles[i].cost} credits</span>
                <br>
                <span>Vehicle Class: ${app.allVehicles[i].vehicle_class}</span>
                <br>
                <span>Speed ${app.allVehicles[i].max_atmosphering_speed}km/h</span>
                <br>
                <span>Cargo Capacity: ${app.allVehicles[i].cargo_capacity}kg</span>
                <br>
                <span>Length: ${app.allVehicles[i].length}m</span>
                <br>
                <span>Crew: ${app.allVehicles[i].crew}</span>
                <br>
                <span>Passengers: ${app.allVehicles[i].passengers}</span>
                </p>
                `)
        }
    }
}
