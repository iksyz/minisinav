// pages/api/courses.js

export const runtime = 'experimental-edge';

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

export default function handler() {
    const quizData = require('../../sorular.json');
    const coursesByCategory = getCoursesByCategory(Array.isArray(quizData) ? quizData : []);

    return new Response(JSON.stringify(coursesByCategory), {
        status: 200,
        headers: {
            'content-type': 'application/json; charset=utf-8',
            'cache-control': 'public, max-age=300',
        },
    });
}
