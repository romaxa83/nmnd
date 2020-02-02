// перенос в мидлевар пагинации,сортировки,выборке по полям
const advancedResult = (model, populate) => async (req, res, next) => {
    let query;
    // Copy req.query
    const reqQuery = { ...req.query };

    // удаляем параметр select и sort,чтоб они не попали с данным для фильтрации фильтрации
    const removeFields = ['select', 'sort', 'page', 'limit'];
    removeFields.forEach(param => delete reqQuery[param]);

    // create query string
    // получаем query - параметры для фильтрации
    let queryStr = JSON.stringify(reqQuery);
    // если приходи в таком ввиде(averageCost[lte]=100) то к lte добавляем символ '$'
    // т.к. mongo нужно передать $lte
    // @see https://docs.mongodb.com/manual/reference/operator/query/lte/
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    query = model.find(JSON.parse(queryStr));

    // указываем те поля которые нужно вернуть
    // если был запрос по типу '?select=name,description'
    if(req.query.select){
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }

    // сортируем
    if(req.query.sort){
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await model.countDocuments();

    query = query.skip(startIndex).limit(limit);

    // если передана связь, подключаем ее
    if(populate){
        query = query.populate(populate)
    }

    const results = await query;

    // Pagination result
    const pagination = {};

    if(endIndex < total){
        pagination.next = {
            page: page + 1,
            limit
        };
    }

    if(startIndex > 0){
        pagination.prev = {
            page: page - 1,
            limit
        };
    }

    res.advancedResult = {
        success: true,
        count: results.length,
        pagination,
        data: results
    };

    next();
};

module.exports = advancedResult;