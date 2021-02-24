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
        app.searchAPI(app.modelSelected)
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

// This function will search the API for the selected model
app.searchAPI = (item) => {
    if (item === '') return // prevents searching before options are selected

    let formatted = item.split(' ').join('%20')
    $.ajax({
            url: `https://swapi.dev/api/vehicles/?search=${formatted}`,
            method: 'GET',
            dataType: 'json',
        }).then(res => {
            app.displaySelected(res.results[0])
            // console.log(res.results[0].name);
        });
}

// remove duplicates and populate dropdown with manufacturers
app.renderManufacturers = (manufacturers) => {
    const unique = [...new Set(manufacturers)].sort()
    $('#make').empty();
    $('#make').append(`<option class="make" value="">Select a Make</option>`)
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
    $('#models').append(`<option value="">Select a Model</option>`)
    vehicles.forEach(model => {
        $('#models').append(`<option class="model" value="">${model.name}</option>`)
    })
    // console.log('Rendered');
}

// This function takes the response from the searchAPI function and renders the vehicle specs on the page
app.displaySelected = (item) => {
    $('.description').empty()
    $('.description').append(`
    <h3>${item.name}</h3>
    <p>
    <span>Manufacturer: ${item.manufacturer}</span>
    <br>
    <span>Cost: ${item.cost_in_credits} credits</span>
    <br>
    <span>Vehicle Class: ${item.vehicle_class}</span>
    <br>
    <span>Speed ${item.max_atmosphering_speed}km/h</span>
    <br>
    <span>Cargo Capacity: ${item.cargo_capacity}kg</span>
    <br>
    <span>Length: ${item.length}m</span>
    <br>
    <span>Crew: ${item.crew}</span>
    <br>
    <span>Passengers: ${item.passengers}</span>
    </p>
    `);
};

