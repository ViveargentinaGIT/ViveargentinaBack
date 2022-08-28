# ViveargentinaBack
<p align="center">
  <img height="200" src="./vive argentina.png" />
</p>

This is the api for the proyect `Viveargentina`. It's build with Node JS and a connection with a postgres DB via Sequelize.

## Routes
- Administrators:
    - GET https://viveargentina.herokuapp.com/administrators
        - req: null
        - res: [{id, name, email, password}...] `(list of all administrators)`
    - POST https://viveargentina.herokuapp.com/administrators
        - req: { name, email, password } body
        - res: newAdministrator
    - DELETE https://viveargentina.herokuapp.com/administrators
        - req: {adminId} params
        - res: 'Administrator deleted successfully'
    - PUT https://viveargentina.herokuapp.com/administrators
        - req: {adminId} query && {name, email, password} body 
        - res: 'Administrator updated successfully'

- Categories:
    - GET https://viveargentina.herokuapp.com/categories
        - req: {categoryId} params
        - res: {id, name, experiences: [{}...]} `(category with the id provided "categoryId")`
    - GET https://viveargentina.herokuapp.com/categories
        - req: null
        - res: [{id,name,experiences:[]}...] `(list of all categories)`
    - POST https://viveargentina.herokuapp.com/categories
        - req: {name} body
        - res: newCategory
    - DELETE https://viveargentina.herokuapp.com/categories
        - req: {categoryId} params
        - res: 'Category deleted successfully'
    - PUT https://viveargentina.herokuapp.com/categories
        - req: {categoryId} query && {name} body
        - res: 'Category updated successfully'

- Cities:
    - GET https://viveargentina.herokuapp.com/cities
        - req: {cityId} params
        - res: {id, name, subtitle, description, score, image, video, regionId, region:{id,name}, packages:[{}...]} `(city with provided id "cityId")`
    - GET https://viveargentina.herokuapp.com/cities
        - req: {name} query
        - res: [{id, name, subtitle, description, score, image, video, regionId, region:{id,name}, packages:[{}...]}...] `(list of cities with provided subtring "name" in name)`
    - GET https://viveargentina.herokuapp.com/cities
        - req: null
        - res: [{id, name, subtitle, description, score, image, video, regionId, region:{id,name}, packages:[{}...]}...] `(list of all the cities)`
    - POST https://viveargentina.herokuapp.com/cities
        - req: {name, subtitle, score, description, image, video, regionId} body
        - res: newCity
    - DELETE https://viveargentina.herokuapp.com/cities
        - req: {cityId} params
        - res: 'City deleted successfully'
    - PUT https://viveargentina.herokuapp.com/cities
        - req: {cityId} query && {name, subtitle, score, description, image, video, regionId} body
        - res: 'City updated successfully'

- Experiences:
    - GET https://viveargentina.herokuapp.com/experiences
        - req: {experienceId} params
        - res: {id, name, subtitle, price, description, image, video, duration, stock, score, disabled, categoryId, category: {}, packageID, package: {}} `(experience with provided id "experienceId")`
    - GET https://viveargentina.herokuapp.com/experiences
        - req: {name} query
        - res: [{id, name, subtitle, price, description, image, video, duration, stock, score, disabled, categoryId, category: {}, packageID, package: {}}...] `(list of experiences with provided subtring "name" in name)`
    - GET https://viveargentina.herokuapp.com/experiences
        - req: null
        - res: [{id, name, subtitle, price, description, image, video, duration, stock, score, disabled, categoryId, category: {}, packageID, package: {}}...] `(list of all the experiences)`
    - POST https://viveargentina.herokuapp.com/experiences
        - req: {name, subTitle, price, description, image, video, duration, stock, score, categoryId, packageId} body
        - res: newExperience
    - DELETE https://viveargentina.herokuapp.com/experiences
        - req: {experienceId} params
        - res: 'Experience deleted successfully'
    - PUT https://viveargentina.herokuapp.com/experiences
        - req: {experienceId} query && {name, subTitle, price, description, image, video, duration, stock, score, categoryId, packageId} body
        - res: 'Experience updated successfully'

- Packages:
    - GET https://viveargentina.herokuapp.com/package
        - req: {packageId} params
        - res: {id, name, subtitle, description, image, video, price, stock, score, duration, cityId, city: {}, experiences: [{}...]} `(package with provided id "packageId")`
    - GET https://viveargentina.herokuapp.com/package
        - req: {name} query
        - res: [{id, name, subtitle, description, image, video, price, stock, score, duration, cityId, city: {}, experiences: [{}...]}...] `(list of packages with provided subtring "name" in name)`
    - GET https://viveargentina.herokuapp.com/package
        - req: null
        - res: [{id, name, subtitle, description, image, video, price, stock, score, duration, cityId, city: {}, experiences: [{}...]}...] `(list of all the packages)`
    - POST https://viveargentina.herokuapp.com/package
        - req: {name, description, image, video, price, duration, stock, score, subTitle, cityId} body
        - res: newPackage
    - DELETE https://viveargentina.herokuapp.com/package
        - req: {packageId} params
        - res: 'Package deleted successfully'
    - PUT https://viveargentina.herokuapp.com/package
        - req: {packageId} query && {name, description, image, video, price, duration, stock, score, subTitle, cityId} body
        - res: 'Package updated successfully'

- Providers:
    - GET https://viveargentina.herokuapp.com/providers
        - req: {name} query
        - res: [{id, name, email, password, experiences:[{}...]}] `(list of providers with provided subtring "name" in name)` 
    - GET https://viveargentina.herokuapp.com/providers
        - req: null
        - res: [{id, name, email, password, experiences:[{}...]}] `(list of all the providers)`
    - POST https://viveargentina.herokuapp.com/providers
        - req: {name, email, password} body
        - res: newProvider
    - DELETE https://viveargentina.herokuapp.com/providers
        - req: {providerId} params
        - res: 'Provider deleted successfully'
    - PUT https://viveargentina.herokuapp.com/providers
        - req: {providerId} query && {name, email, password} body
        - res: 'Provider updated successfully'

- Queries:
    - GET https://viveargentina.herokuapp.com/queries
        - req: null
        - res: [{id, text, date, status, userId, user: {}}...] `(list of all queries)`
    - POST https://viveargentina.herokuapp.com/queries
        - req: {text, date, userId}
        - res: newQuery
    - DELETE https://viveargentina.herokuapp.com/queries
        - req: {queryId} params
        - res: 'Query deleted successfully'
    - PUT https://viveargentina.herokuapp.com/queries
        - req: {queryId} query && {text, date, userId} body
        - res: 'Query updated successfully'

- Regions:
    - GET https://viveargentina.herokuapp.com/regions
        - req: {regionId} params
        - res: {id, name, cities: [{}...]} `(region with provided id "regionId")`
    - GET https://viveargentina.herokuapp.com/regions
        - req: null
        - res: [{id, name, cities: [{}...]}...] `(list of all regions)`
    - POST https://viveargentina.herokuapp.com/regions
        - req: {name} body
        - res: newRegion
    - DELETE https://viveargentina.herokuapp.com/regions
        - req: {regionId} params
        - res: 'Region deleted successfully'
    - PUT https://viveargentina.herokuapp.com/regions
        - req: {regionId} query && {name} body
        - res: 'Region updated successfully'

- Reviews:
    - GET https://viveargentina.herokuapp.com/reviews
        - req: null
        - res: [{id, text, date, userId, user: {}}...] `(list of all reviews)`
    - POST https://viveargentina.herokuapp.com/reviews
        - req: {text, date, userId} body
        - res: newReview
    - DELETE https://viveargentina.herokuapp.com/reviews
        - req: {reviewId} params
        - res: 'Review deleted successfully'
    - PUT https://viveargentina.herokuapp.com/reviews
        - req: {reviewId} query && {text, date, userId} body
        - res: 'Review updated successfully'

- Users
    - GET https://viveargentina.herokuapp.com/users
        - req: null
        - res: [{id, name, email, password, registered, queries: [{}...], reviews: [{}...]}...] `(list of all users)`
    - POST https://viveargentina.herokuapp.com/users
        - req: {name, email, password} body
        - res: newUser
    - DELETE https://viveargentina.herokuapp.com/users
        - req: {userId} params
        - res: 'User deleted successfully'
    - PUT https://viveargentina.herokuapp.com/users
        - req: {userId} query && {name, email, password} body
        - res: 'User updated successfully'

`(Routes PUT requires at least one of the elements by body and the ID by query)`