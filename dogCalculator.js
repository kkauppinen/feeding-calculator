window.onload = function() {
    document.getElementById("energy_need").addEventListener("click", calcCalorieRequirement);
}

function calcCalorieRequirement() {
    let energyRequirement;
    let dogWeight = Number(document.getElementById("weight").value);
    let idealWeight = Number(document.getElementById("normal_weight").value);

    if (idealWeight === 0) {
        idealWeight = calcIdealWeightByBcs(dogWeight);
    }
       
    let isDogObese = isObese(dogWeight, idealWeight);

    if (isDogObese < 0) {
        document.getElementById("message").innerHTML = "Laskuri ei sovellu alipainoisille lemmikeille."
        return;
    } else if (isDogObese === 0) {
        let dogRer = calcRer(idealWeight);
        let factor;
        let factorSelector = document.getElementsByName("energy_factor");

        for (let i = 0; i < factorSelector.length; i++) {
            if (factorSelector[i].checked) {
                factor = factorSelector[i].value;
            }
        }

        energyRequirement = (dogRer * factor).toFixed(0);
        printResults(dogWeight, idealWeight, false, energyRequirement);
    } else {
        energyRequirement = calcRer(idealWeight).toFixed(0);
        printResults(dogWeight, idealWeight, true, energyRequirement);
    }

    calcFeedingAmount(energyRequirement);
}

function isObese (currentWeight, idealWeight) {
    if (idealWeight > currentWeight) {
        let underWeightFactor = currentWeight / idealWeight;
        if (underWeightFactor < 0.9) {
            return -1;
        } else {
           return 0; 
        }
    } else if (idealWeight == currentWeight) {
        return 0;
    } else {
        return 1;
    }
}

function calcIdealWeightByBcs(weight) {
    let weightFactor;
    let bcs = Number(document.getElementById("bcs").value);

    weightFactor = 0.5 + (0.1 * bcs);
    idealWeight = weight / weightFactor;

    return idealWeight.toFixed(1);
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
        overWeightPercentId.innerHTML = "...";
        weightLossId.innerHTML = "...";
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

function calcFeedingAmount(energyRequirement) {
    let feedingStyle, foodAmount;
    let feedingSelector = document.getElementsByName("feeding_implementation");

        for (let i = 0; i < feedingSelector.length; i++) {
            if (feedingSelector[i].checked) {
                feedingStyle= feedingSelector[i].value;
            }
        }

    if (feedingStyle == 1) {
        let energyContentDry = document.getElementById("energy_content_dry").value;
        let energyUnit = document.getElementById("energy_unit_dry");
        let unitValue = energyUnit.options[energyUnit.selectedIndex].value;

        if (unitValue > 0) {
            energyContentDry = convertJoulesToCalories(energyContentDry);
        }

        foodAmount = (energyRequirement / energyContentDry * 100).toFixed(0);
        document.getElementById("feeding_amount").innerHTML = foodAmount;
    } else if (feedingStyle == 2) {
        let energyContentWet = document.getElementById("energy_content_wet").value;
        let energyUnit = document.getElementById("energy_unit_wet");
        let unitValue = energyUnit.options[energyUnit.selectedIndex].value;
        let canWeight = document.getElementById("unit_weight");
        var canValue = canWeight.options[canWeight.selectedIndex].value;

        if (unitValue > 0) {
            energyContentWet = convertJoulesToCalories(energyContentWet);
        }

        foodAmount = (energyRequirement / energyContentWet * 100).toFixed(0);
        let numberOfCans = (foodAmount / Number(canValue)).toFixed(1);
        document.getElementById("feeding_amount").innerHTML = foodAmount + " g <br>" + numberOfCans + " purkkia";
    } else {
        let energyContentDry = document.getElementById("energy_content_dry").value;
        let energyContentWet = document.getElementById("energy_content_wet").value;
        let energyUnitWet = document.getElementById("energy_unit_wet");
        let energyUnitDry = document.getElementById("energy_unit_dry");
        let unitValueWet = energyUnitWet.options[energyUnitWet.selectedIndex].value;
        let unitValueDry = energyUnitDry.options[energyUnitDry.selectedIndex].value;
        let canWeight = document.getElementById("unit_weight");
        var canValue = canWeight.options[canWeight.selectedIndex].value;

        if (unitValueDry > 0) {
            energyContentDry = convertJoulesToCalories(energyContentDry)
        }

        if (unitValueWet > 0) {
            energyContentWet = convertJoulesToCalories(energyContentWet);
        }
        
        let wetFoodCalories = energyContentWet / 100 * canValue;
        let remainingCalories = energyRequirement - wetFoodCalories;
        foodAmount = (remainingCalories / energyContentDry * 100).toFixed(0);
        document.getElementById("feeding_amount").innerHTML = foodAmount + " g kuivaruokaa ja<br>" + canValue + " g  märkäruokaa";
    }
}

function convertJoulesToCalories (energyContent) {
    return ((energyContent / 4.184).toFixed(0));
}
