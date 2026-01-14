// pages/api/courses.js

const slugToCategory = (slug) => {
    return String(slug || '').toUpperCase().replace(/-/g, '_');
};

function getCoursesByCategory(quizData) {
    const coursesByCategory = {};

    quizData.forEach((quiz) => {
        if (!quiz.kategori || !quiz.dersSlug) return;

        const categoryId = slugToCategory(quiz.kategori);

        if (!coursesByCategory[categoryId]) {
            coursesByCategory[categoryId] = new Map();
        }

        if (!coursesByCategory[categoryId].has(quiz.dersSlug)) {
            coursesByCategory[categoryId].set(quiz.dersSlug, {
                title: quiz.ders,
                slug: quiz.dersSlug,
            });
        }
    });

    const result = {};
    Object.keys(coursesByCategory).forEach((cat) => {
        result[cat] = Array.from(coursesByCategory[cat].values());
    });

    return result;
}

export default function handler(req, res) {
    const quizData = require('../../sorular.json');
    const coursesByCategory = getCoursesByCategory(Array.isArray(quizData) ? quizData : []);

    res.setHeader('Cache-Control', 'public, max-age=300');
    res.status(200).json(coursesByCategory);
}
