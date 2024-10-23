/* eslint-disable prefer-const */
class ApiFeatures {
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString
  };
  //1) filtering

  filter() {
    const queryStringObj = { ...this.queryString };
    const excludesFieldes = ['page', 'limit', "sort", "fields", 'keyword'];
    excludesFieldes.forEach(field => delete queryStringObj[field]);
    //Apply filttration using [gte,gt,lte,le]
    let queryStr = JSON.stringify(queryStringObj);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`);
    this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStr));

    return this;
  }
  //3(sorting)

  sort() {
    if (this.queryString.sort) {
      //price, -sold ==> [price,-sold] price -sold
      const sortBy = this.queryString.sort.split(',').join(' ')
      this.mongooseQuery = this.mongooseQuery.sort(sortBy)
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("-createdAt")
    }
    return this
  }
  //4(fields limiting)

  limitFields() {
    if (this.queryString.fields) {
      //tilte,ratindsAverage,imageCover
      const fields = this.queryString.fields.split(',').join(' ');
      //tilte ratindsAverage imageCover
      this.mongooseQuery = this.mongooseQuery.select(fields)
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-_v")
    };
    return this
  }
  //5(search)

  search(modelName) {

    if (this.queryString.keyword) {

      let query = {};
      if (modelName === "Products") {
        query.$or= [
          { title: { $regex: this.queryString.keyword, $options: 'i' } },
          { description: { $regex: this.queryString.keyword, $options: 'i' } },
        ];
      } else {
        query = { name: { $regex: this.queryString.keyword, $options: 'i' } };
      }
        
      this.mongooseQuery = this.mongooseQuery.find(query);
    }
    return this
  }
  //2) Pagination

  Pagination(countDoucments) {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 50;
    const skip = (page - 1) * limit;
    const endIndexPage = page*limit;

    //Pagination result;
    const pagination = {};
    pagination.currentPage = page;
    pagination.limit = limit;
    //50 doc / 10 prod  = 5 p
    pagination.numbersOfPages = Math.ceil(countDoucments / limit);

    //next page
    if (endIndexPage < countDoucments) {
      pagination.next = page + 1;
    };

    if (skip > 0) {
      pagination.prev = page - 1;
    };

    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
    this.paginationResult = pagination;
    return this;
  }
}


export default ApiFeatures