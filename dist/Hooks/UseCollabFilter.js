"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneralWeightedAverage = void 0;
const PearsonCorrelation = (data_set_A, data_set_B) => {
    let numer = SumProductMeanDeviation(data_set_A, data_set_B);
    let denomer = ProductSumSquareMeanDeviation(data_set_A, data_set_B);
    let correlation = numer / denomer;
    if (!correlation || isNaN(correlation)) {
        return -1;
    }
    else {
        return correlation;
    }
};
const SumProductMeanDeviation = (data_set_A, data_set_B) => {
    let sum = 0;
    for (let i = 0; i < data_set_A.length; i++) {
        if (data_set_A[i] != 0 && data_set_B[i] != 0) {
            sum += ProductMeanDeviation(data_set_A, data_set_B, i);
        }
    }
    return sum;
};
const ProductMeanDeviation = (data_set_A, data_set_B, index) => {
    const mean_dev_set_a = MeanDeviation(data_set_A, index);
    const mean_dev_set_b = MeanDeviation(data_set_B, index);
    const prod_mean_dev = mean_dev_set_a * mean_dev_set_b;
    return prod_mean_dev;
};
const MeanDeviation = (data_set, index) => {
    const average = Average(data_set);
    return data_set[index] - average;
};
const Average = (data_set) => {
    let sum = 0;
    let len = 0;
    for (let i = 0; i < data_set.length; i++) {
        if (data_set[i] != 0) {
            sum += data_set[i];
            len++;
        }
    }
    return sum / len;
};
//--------------
const ProductSumSquareMeanDeviation = (data_set_A, data_set_B) => {
    const data_set_a_res = SumSquareMeanDeviation(data_set_A);
    const data_set_b_res = SumSquareMeanDeviation(data_set_B);
    const product = data_set_a_res * data_set_b_res;
    if (product == 0) {
        return -1;
    }
    else {
        return product;
    }
};
const SumSquareMeanDeviation = (data_set) => {
    let sum = 0;
    for (let i = 0; i < data_set.length; i++) {
        if (data_set[i] != 0) {
            sum = sum + SquareMeanDeviation(data_set, i);
        }
    }
    return Math.sqrt(sum);
    // return sum;
};
const GeneralWeightedAverage = (data_set) => {
    let sum_prod_score_rating = 0;
    let sum_sim_scores = 0;
    for (let i = 0; i < data_set.length; i++) {
        if (data_set[i].sim_score > 0) {
            const prod_score_rating = data_set[i].sim_score * data_set[i].rating;
            const sim_scores = data_set[i].sim_score;
            sum_prod_score_rating += prod_score_rating;
            sum_sim_scores += sim_scores;
        }
    }
    const result = sum_prod_score_rating / sum_sim_scores;
    return isNaN(result) ? 0 : result;
};
exports.GeneralWeightedAverage = GeneralWeightedAverage;
const SquareMeanDeviation = (data_set, index) => {
    const mean_dev_result = MeanDeviation(data_set, index);
    return mean_dev_result * mean_dev_result;
};
const EuclideanDistance = (sim_core, rating) => {
    const diff_sim_rating = sim_core - 1;
    const diff_rating = rating - 2.5;
    const square_sim_rating = Math.pow(diff_sim_rating, 2);
    const square_diff_rating = Math.pow(diff_rating, 2);
    const sum_squares = square_sim_rating + square_diff_rating;
    const result = Math.sqrt(sum_squares);
    return result;
};
const RatingPrediction = (tutor_pk, tutors, students, ratings, student_ratings) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const data_set = [];
    const tutor_sim_scores = [];
    //mark sunner - nhordz = .87
    //mark sunner - bazar = .3
    for (const t of tutors) {
        const student_tutor_ratings = [];
        for (const s of students) {
            const found_index = ratings.findIndex((r) => r.student_pk === s.student_pk && t.tutor_pk === r.tutor_pk);
            student_tutor_ratings.push({
                student_pk: s.student_pk,
                rating: !!((_a = ratings[found_index]) === null || _a === void 0 ? void 0 : _a.rating)
                    ? ratings[found_index].rating
                    : 0,
            });
        }
        data_set.push({
            tutor: t.tutor_pk,
            students: student_tutor_ratings,
        });
    }
    const index_tutor_to_compare = data_set.findIndex((d) => d.tutor === tutor_pk);
    if (index_tutor_to_compare !== -1) {
        const compare_tutor_ratings = data_set[index_tutor_to_compare].students.map((v) => v.rating);
        for (let i = 0; i < data_set.length; i++) {
            if (i !== index_tutor_to_compare) {
                const other_tutor_ratings = data_set[i].students.map((v) => v.rating);
                //marksunner - nhordz
                const sim_score = PearsonCorrelation(other_tutor_ratings, compare_tutor_ratings);
                console.log(`sim score`, sim_score);
                tutor_sim_scores.push(sim_score);
            }
        }
        const pcc_data_set = [];
        for (let i = 0; i < student_ratings.length; i++) {
            for (let x = 0; x < data_set.length; x++) {
                if (student_ratings[i].tutor_pk === data_set[x].tutor) {
                    pcc_data_set.push({
                        sim_score: tutor_sim_scores[x],
                        rating: student_ratings[i].rating,
                        distance: EuclideanDistance(tutor_sim_scores[x], student_ratings[i].rating),
                    });
                }
            }
        }
<<<<<<< HEAD
        console.log(`pcc_data_set`, pcc_data_set);
=======
>>>>>>> laptop
        return (0, exports.GeneralWeightedAverage)(pcc_data_set);
    }
    else {
        return 0;
    }
});
exports.default = {
    PearsonCorrelation,
    EuclideanDistance,
    GeneralWeightedAverage: exports.GeneralWeightedAverage,
    RatingPrediction,
};
//# sourceMappingURL=UseCollabFilter.js.map