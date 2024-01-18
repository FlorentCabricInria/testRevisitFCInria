
    console.log("Hey I am here")
    //const seedrandom = require("seedrandom")

    var random = Math.seedrandom("0.45454");
    //var random = seedrandom("0.45454");
    var random =  new Math.seedrandom("0.45454");
    console.log("Hey I am here")

    d3.csv("./csvTest.csv").then((data) =>
    {
        const taskID = "scatterplot2";
        const loc = "belowStimulus"
        console.log(data)
        var storedData = structuredClone(data);
        // Specify the chart’s dimensions.
        const width = 1280;
        const height = 800;
        const marginTop = 5;
        const marginRight = 0;
        const marginBottom = 5;
        const marginLeft = 0;
        const radius = 2;

        var totalSalaryWomen = 0.0;
        var nbWomen = 0;
        var nbMen = 0;
        var totalSalaryMen = 0.0;
        storedData.forEach(function (d) {
            if (d.gender == "W") {
                totalSalaryWomen += parseFloat(d.salary)
                nbWomen++;
            } else {
                totalSalaryMen +=  parseFloat(d.salary)
                nbMen++;
            }
        });
        var diff = parseFloat((totalSalaryMen / nbMen) / (totalSalaryWomen / nbWomen));
        console.log(totalSalaryMen / nbMen, " - ", (totalSalaryWomen / nbWomen), 'difference ', diff)
        d3.select("#PayGap").text("Paygap is " + ((totalSalaryMen / nbMen) - (totalSalaryWomen / nbWomen)))
        // Define the horizontal scale.
        const x = d3.scaleLinear()
            .domain([0, 100])
            .range([marginLeft, width - marginRight]);

        // Define the vertical scale.
        const y = d3.scaleLinear()
            //.domain(d3.extent(genderData, d => d.salary)).nice()
            .domain([0, 250000])
            .range([height - marginBottom, marginTop]);

        // Create the container SVG.
        const svg = d3.select("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [0, 0, width, height])
            .attr("style", "max-width: 100%; height: auto;");

        var a = d3.group(storedData, d => d.gender)
        console.log(a)
        // Add the axes.
        svg.append("g")
            .attr("transform", `translate(0,${height - marginBottom})`)
            .call(d3.axisBottom(x));

        svg.append("g")
            .attr("transform", `translate(${marginLeft},0)`)
            .call(d3.axisLeft(y));

        var updateData = function (data, newvalue) {
            var u = d3.selectAll(".dot")

        }
        var highlight = function (event, d) {
            var selected_gender = d.gender
            d3.selectAll(".dot")
                .transition()
                .duration(200)
                .style("fill", "lightgrey")
                .attr("r", 3)
            d3.selectAll("." + selected_gender)
                .transition()
                .duration(200)
                .style("fill", color(selected_gender))
                .attr("r", 4)
        }

        // Highlight the specie that is hovered
        var doNotHighlight = function (event, d) {
            d3.selectAll(".dot")
                .transition()
                .duration(200)
                .style("fill", function (d) {
                    return color(d.gender)
                })
                .attr("r", 3)
        }
        var started = function (event, d) {
            console.log('drag event start', d.salary, ' ', d.gender)
        }

        const drag = d3.drag();
        d3.selectAll(".dot").call(d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended));
        /* const drag = d3.drag()
             .on("start", (event, d) => circle.filter(p => p === d).raise().attr("stroke", "black"))
             .on("drag", (event, d) => (d.x = event.x, d.y = event.y))
             .on("end", (event, d) => circle.filter(p => p === d).attr("stroke", null))*/
        const color = d3.scaleOrdinal()
            .domain(["M", "W"])
            .range(["#266DF0FF", "#F040EFFF"]);

        const gender = d3.scaleOrdinal()
            .domain(["#266DF0FF", "#F040EFFF"])
            .range(["M", "W"]);

        function dragstarted(event, d) {
            console.log(d.id, d.gender, d.salary, storedData[d.id].salary, 'start')
        }

        function dragged(event, d) {
            //console.log( '######## DRAGGED ######')
            /*  console.log('update', d.gender,d.salary,d.val)
             var current_dot = d3.select(this)
           console.log(d3.select(this).attr("cy"))*/
        }

        function dragended(event, d) {
            console.log(d.gender, d.salary, storedData[d.id].salary, 'end');
        }

        function update(event, d) {
           //  console.log( '######## UPDATE ######')
          //  console.log('update', d.gender,d.salary,data[d.id])
            var current_dot = d3.select(this)
            /* var tcy = current_dot.attr('cy')
             var tcx = current_dot.attr('cx')   */
            var oldValue = parseFloat(d.salary)
            var newSalary = parseFloat(y.invert(event.y))
            if (parseFloat(newSalary) < parseFloat(d.baseSalary) + parseFloat((d.baseSalary * 0.1)) && parseFloat(newSalary) > parseFloat(d.baseSalary)) {
           //     console.log("update in progress")
                storedData[d.id].salary = newSalary
                d.salary = newSalary
                if (d.gender == "W") {
                    totalSalaryWomen += oldValue - (storedData[d.id].salary)
                } else {
                    totalSalaryMen += oldValue - (storedData[d.id].salary)
                }
                d3.select("#PayGap").text("Paygap is " + ((totalSalaryMen / nbMen) - (totalSalaryWomen / nbWomen)))
                Revisit.postAnswers(
                    {answer:[((totalSalaryMen / nbMen) - (totalSalaryWomen / nbWomen))], taskID,location:loc}
                );
                current_dot.attr('cy', event.y)
            //    console.log("update in done")


            }
        }

        svg.append("g")
            .selectAll("circle")
            .data(storedData)
            .join(
                function (enter) {
                    return enter
                        .append("circle")
                        .attr("id", d => d.id)
                        .attr("cx", function (d, i) {
                            if (d.gender == "M") {
                                return (width / 3) + (random.double() * (200)) - 100;
                            } else {
                                return (2 * width / 3) + (random.double() * (200)) - 100;
                            }
                        })
                        .attr("cy", d => y(d.salary))
                        .attr("r", 3)
                        .attr("class", function (d) {
                            return "dot " + d.gender
                        })
                        .style("fill", function (d) {
                            return color(d.gender)
                        })
                        .on("mouseover", highlight)
                        .on("mouseleave", doNotHighlight)
                        .call(d3.drag()
                            .on("start", dragstarted)
                            .on("drag", dragged)
                            .on("end", dragended)
                            .on("drag.update", update));
                })

    });
    // return svg.node();
