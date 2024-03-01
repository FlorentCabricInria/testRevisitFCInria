
    console.log("Hey I am here")
    //const seedrandom = require("seedrandom")

    var random = Math.seedrandom("0.45454");
    //var random = seedrandom("0.45454");
    var random =  new Math.seedrandom("0.45454");
    console.log("Hey I am here")
    const width = 800;
    const height = 400;
    const marginTop = 40;
    const marginRight = 40;
    const marginBottom = 40;
    const marginLeft = 50;
    const radius = 2;
    data30 = d3.csv("./prediction-grade-group3-4-5.csv");
    //.then((data) =>
    //{
    const taskID = "scatterplot2";
    const loc = "belowStimulus"
   // console.log(data)
    //var storedData = structuredClone(data);

    const y = d3.scaleLinear()
        //.domain(d3.extent(genderData, d => d.salary)).nice()
        .domain([90000,20000])
        .range([0 + marginBottom, height - marginTop]);

    const x = d3.scaleLinear()
        //.domain(d3.extent(genderData, d => d.salary)).nice()
        .domain([0, 4])
        .range([marginLeft, width - marginRight]);
    var coefSize = 2.5;
    var perfVisual = "size"
    const dfPeople = [];
    var seed="45457"
    var  random = new Math.seedrandom(seed)
    const structForModel = []
   // if(nbElem=="30"){
 //   var data= structuredClone(data30)
    d3.csv("./prediction-grade-group3-4-5.csv").then((data) => {

        var storedData = structuredClone(data);

        var random2 = new Math.seedrandom(seed)
        var random3 = new Math.seedrandom(seed)

        var random4 = new Math.seedrandom(seed)
        var random5 = new Math.seedrandom(seed)


        var id = 0;
        /** PREPARATION FOR REGRESSION **/
        data.forEach(function (d) {
            var person = {
                gender: parseInt(d.gender),
                gender_f1: parseInt(d.gender) === 1 ? 1 : 0, //special case where men are "1" and women are "2"
                gender_f2: parseInt(d.gender) === 2 ? 1 : 0, //special case where men are "1" and women are "2"
                performance_f1: parseInt(d.performance) === 0 ? 1 : 0,
                performance_f1: parseInt(d.performance) === 1 ? 1 : 0,
                performance_f2: parseInt(d.performance) === 2 ? 1 : 0,
                performance_f3: parseInt(d.performance) === 3 ? 1 : 0,
                grade_group_f3: parseInt(d.performance) === 3 ? 1 : 0,
                grade_group_f4: parseInt(d.performance) === 4 ? 1 : 0,
                grade_group_f5: parseInt(d.performance) === 5 ? 1 : 0,
                grade_group: parseInt(d.grade_group),
                total_comp: parseInt(d.total_comp)
            }
            dfPeople[id] = person
            id++;
        });

        // Create the container SVG.
        const svg = d3.select("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [0, 0, width, height])
            .attr("style", "max-width: 100%; height: auto;");

        //  var a = d3.group(data, d => d.gender)
        svg.append("g")
            .attr("transform", `translate(${marginLeft},0)`)
            .call(d3.axisLeft(y));

        svg.append("g")
            .attr("transform", `translate(0,${height - marginBottom})`)
            .call(d3.axisBottom(x).tickArguments([5]).tickFormat(function(x) {
                if (x==1 || x ==2 || x ==3)
                return x
            }));


         //

        const color = d3.scaleOrdinal()
            .domain(["1", "2" ])
            .range([ "#266DF0FF", "#F040EFFF"]);

        const shape = d3.scaleOrdinal(data.map(d => d.species), d3.symbols.map(s => d3.symbol().type(s)()));
        /**
         *          #########################################################
         *          ########### LEGEND
         *          #########################################################
         */
        svg.append("circle").attr("cx",width-100).attr("cy",130).attr("r", 6).style("fill", "#266DF0FF")
        svg.append("circle").attr("cx",width-100).attr("cy",160).attr("r", 6).style("fill", "#F040EFFF")
        svg.append("text").attr("x", width-80).attr("y", 130).text("Men").style("font-size", "15px").attr("alignment-baseline","middle")
        svg.append("text").attr("x", width-80).attr("y", 160).text("Women").style("font-size", "15px").attr("alignment-baseline","middle")


        /**
         #########################################################
         CREAT GHOST DOTS
         #########################################################
         **/

        svg.append("g")
            .selectAll("circle")
            .data(data)
            .join(
                function(enter){
                    return enter
                        .append("circle")
                        .attr("id", d=> d.key)
                        .attr("cx",  function(d) {
                            return(x(d.grade_group-2) + (random5.double()*(100))-50)
                        } )
                        .attr("cy", d=> y(d.total_comp));
                })
            .attr("r", d => (parseInt(d.performance) + 1.75) * coefSize)
            .style("fill", "#AAAAAA88" )

        /**
         * #########################################################
         * CREATE GHOST LINE
         * #########################################################         *
         * **/
        svg.append("g")
            .selectAll('line')
            .data(data)
            .join(
                function(enter){
                    return enter
                        .append("line")
                        .attr("x1", function(d) {
                            return(x(d.grade_group-2) + (random3.double()*(100))-50)
                        } )
                        .attr("x2", function(d) {
                            return(x(d.grade_group-2) + (random4.double()*(100))-50)
                        } )
                        .attr('y1', function(d) { return y(d.total_comp); })
                        .attr('y2', function(d) {
                            var perf2 = parseFloat(d.total_comp)+parseFloat(d.sugg_raise_perf)
                            var gp= parseFloat(d.total_comp)+parseFloat(d.sugg_raise_gender)
                            return y(Math.max(perf2,gp))
                        })})
            .style("stroke", "#AAAAAAAA" )
            .style("stroke-linecap","round")
            .style('stroke-width', function(d) {return parseInt(3) + 'px';});

        /** CREATE SALARIES MARK **/
        var theCircles = svg.append("g").selectAll("circle")
            .data(data)
            .join(
                function (enter) {
                    return enter
                        .append("circle")
                        .attr("id", d => d.key)
                        .attr("cx", function (d) {
                            return (x(d.grade_group - 2) + (random.double() * (100)) - 50)
                        })
                        .attr("cy", function (d, i) {
                            // console.log(equityslider)
                            //  console.log(notequityslider)
                            var valuePE = parseInt(d3.select("#PayEquity").node().value)
                            var valueNE = parseInt(d3.select("#NotEquity ").node().value)
                            var new_salary = (((valuePE / 50000) * d.sugg_raise_gender) + ((valueNE / 50000) * d.sugg_raise_perf) + parseFloat(d.total_comp))
                            dfPeople[parseInt(d.key) - 1]['total_comp'] = new_salary
                            //  totalGenderPayGap += (-1) * (parseFloat(d.raise_on_pay_gap_gender) * ((50000 - valuePE) / 50000))
                            var ys = y(new_salary);
                            return y(new_salary);
                        })
                        .style("fill", function (d) { return color(d.gender);})

                        .attr("r", function (d) {
                           /* if (radios == "size") {
                                return (d.performance + 2) * coefSize;
                            } else {*/
                                return (parseInt(d.performance) + 1.75) * coefSize;
                            //}
                        })
                        .attr("class", function (d) {
                            return "dot " + d.gender;
                        })
                })


        calculateNewPayGap()
        // Listen to the slider?
        /*d3.select("#PayEquity").on("change", function(d){
            selectedValue = this.value
            changeSalary(selectedValue)
            calculateNewPayGap()
        })*/
        var sliderEquity = document.getElementById("PayEquity");
        var sliderAlt = document.getElementById("NotEquity");
        sliderEquity.addEventListener("input", maxReached, false);

        sliderAlt.addEventListener("input", maxReached, false);
        function maxReached(e){
            PEslider = document.getElementById("PayEquity");
            ALTslider = document.getElementById("NotEquity");
            var sum = parseInt(PEslider.value) + parseInt(ALTslider.value), target;
            //console.log(sum)
            var max= 60000;
            e.currentTarget.innerHTML = e.currentTarget.value;
            if(sum >= max){
                target = e.target;
                target.value = target.value - (sum - max);
                // next line is just for demonstrational purposes
                //document.getElementById('total').innerHTML = parseInt(PEslider.value) + parseInt(ALTslider.value);

                document.getElementById("PEoutput").innerHTML = parseInt(PEslider.value)
                document.getElementById("ALToutput").innerHTML = parseInt(ALTslider.value)
                document.getElementById('textEquity').innerHTML = parseInt(PEslider.value)
                PEslider.innerHTML = parseInt(PEslider.value)
                ALTslider.innerHTML = parseInt(ALTslider)
                document.getElementById('textAlternative').innerHTML = parseInt(ALTslider.value)
                document.getElementById('textRemaining') .innerHTML = (max) - (parseInt(PEslider.value) + parseInt(ALTslider.value))
                e.preventDefault();
                return false;
            }
            else {
                // next line is just for demonstrational purposes
                //document.getElementById('total').innerHTML = parseInt(PEslider.value) + parseInt(ALTslider.value);
                document.getElementById("PEoutput").innerHTML = parseInt(PEslider.value)
                document.getElementById("ALToutput").innerHTML = parseInt(ALTslider.value)
                document.getElementById('textEquity').innerHTML = parseInt(PEslider.value)
                document.getElementById('textAlternative').innerHTML = parseInt(ALTslider.value)
                document.getElementById('textRemaining') .innerHTML = (max) - (parseInt(PEslider.value) + parseInt(ALTslider.value))

                changeSalary()
                calculateNewPayGap();
            }
            /*    document.getElementById('total').innerHTML = parseInt(document.getElementById("PayEquity").value) + parseInt(document.getElementById("NotEquity").value);*/
            return true;
        }

        function changeSalary() {
            var test =d3.selectAll("dot");
            d3.selectAll(".dot")
               // .data(data)
                .attr("cy", function (d, i) {
                    // console.log(equityslider)
                    //  console.log(notequityslider)
                    var valuePE = parseInt(d3.select("#PayEquity").node().value)
                    var valueNE = parseInt(d3.select("#NotEquity ").node().value)
                    var new_salary = (((valuePE / 60000) * d.sugg_raise_gender) + ((valueNE / 60000) * d.sugg_raise_perf) + parseFloat(d.total_comp))
                    dfPeople[parseInt(d.key) - 1]['total_comp'] = new_salary
                    //  totalGenderPayGap += (-1) * (parseFloat(d.raise_on_pay_gap_gender) * ((50000 - valuePE) / 50000))
                    return y(new_salary);
                })
        }
        /*sliderEquity.oninput = function(e) {
            selectedValue = this.value
            changeSalary(selectedValue)
            calculateNewPayGap()
        };
        sliderAlt.oninput = function(e){
            selectedValue = this.value
            maxReached(e)
            changeSalary(selectedValue)
            calculateNewPayGap()
        };*/

    });
function calculateNewPayGap(){
    var GPG = ((Math.exp(lm('log(total_comp) ~ gender_f1 + performance_f1 + performance_f2 + performance_f3 + grade_group_f4 + grade_group_f5',dfPeople).coefficients[1])-1)*100.0).toFixed(2)
    if(GPG >0){
        d3.select("#currentPayGap").text(GPG + "% (women lower)")
    }
    else {
        d3.select("#currentPayGap").text((GPG*-1) + "% (men lower)")
    }
}



    /*}
    else if ( nbElem =="50"){
        var data= structuredClone(genderData_50elem);
    }
    else{
        var data= structuredClone(genderData4);
    }*/
 //   });
    // return svg.node();
