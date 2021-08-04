window.onload = function() {
    document.getElementById("energy_need").addEventListener("click", calcCalorieRequirement);
    document.getElementById("calc_feeding").addEventListener("click", calcFeedingAmount);
}

function calcCalorieRequirement() {
    let dogWeight = Number(document.getElementById("weight").value);
    let idealWeight = Number(document.getElementById("normal_weight").value);

    if (idealWeight === 0) {
        // Get ideal weight by bcs
    }
       
    let isDogObese = isObese(dogWeight, idealWeight);

    if(!isDogObese) {
        let dogRer = calcRer(dogWeight);
        let factor;
        let factorSelector = document.getElementsByName("energy_factor");

        for (let i = 0; i < factorSelector.length; i++) {
            if (factorSelector[i].checked) {
                factor = factorSelector[i].value;
            }
        }

        let energyRequirement = (dogRer * factor).toFixed(0);
        document.getElementById("energy_requirement").innerHTML = energyRequirement;
        printResults(dogWeight, idealWeight, false, energyRequirement);
    } else {
        let dogRer = calcRer(idealWeight).toFixed(0);
        printResults(dogWeight, idealWeight, true, dogRer);
    }
    
}

function isObese (currentWeight, idealWeight) {
    if (idealWeight > currentWeight) {
        // Check if dog is too thin for calorie calculation
        return false;
    } else if (idealWeight === currentWeight) {
        return false;
    } else {
        return true;
    }
}

function calcRer(weight) {
    return (70 * Math.pow(weight, 0.75));
}

function printResults(currentWeight, idealWeight, isObese, calorieRequirement) {
    let idealWeightId = document.getElementById("ideal_weight");
    let overWeightPercentId = document.getElementById("over_weight_percent");
    let overWeightKgId = document.getElementById("over_weight_kg");
    let weightLossId = document.getElementById("weight_loss");
    let energyRequirementId = document.getElementById("energy_requirement");

    if (!isObese) {
        idealWeightId.innerHTML = idealWeight;
        overWeightPercentId.innerHTML = "0 %";
        overWeightKgId.innerHTML = "0 kg";
        weightLossId.innerHTML = " ";
        energyRequirementId.innerHTML = calorieRequirement;
    } else {
        let safeLossMin = calcWeightLoss(currentWeight, 0.01);
        let safeLossMax = calcWeightLoss(currentWeight, 0.02);
        idealWeightId.innerHTML = idealWeight;
        overWeightPercentId.innerHTML = ((currentWeight / idealWeight - 1) * 100).toFixed(0) + " %";
        overWeightKgId.innerHTML = (currentWeight - idealWeight).toFixed(1) + " kg"
        weightLossId.innerHTML = safeLossMin + " - " + safeLossMax + " g viikossa";
        energyRequirementId.innerHTML = calorieRequirement;
    }
}

function calcWeightLoss(weight, factor) {
    return ((weight * 1000) * factor);
}

function calcFeedingAmount() {
    alert("feeding button works!");
}
