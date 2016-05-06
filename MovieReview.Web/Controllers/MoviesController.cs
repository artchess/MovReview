using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using MovieReview.Data.Contracts;
using MovieReview.Model;

namespace MovieReview.Web.Controllers
{
    public class MoviesController : ApiBaseController // heredo de una clase base que contiene mi unidad de trabajo Uow
    {
        public MoviesController(IMovieReviewUow uow) // injección de dependencia, esto va a dar un tipico error de dependencia porque intenta hacer coincidir las peticiones con el tipo correcto, pero no puede resolverlo. Para que funcione esto necesito el Ninject y WebApiContrib.IoC.Ninject para que Ninject soporte Web api que se installa por nuget y es de terceros. http://www.ninject.org/. Para entender Web API y DI (injeccion de dependencias) a detalle, ver http://myview.rahulnivi.net/.Net,ASP.Net,C,EntityFramework,MVC/asp-net-web-api/
        {
            Uow = uow; // instancio la unidad de trabajo. Unit Of Work pattern
        }
        // GET: api/Movies
        public IQueryable Get() //IEnumerable<Movie> Get()
        {
            //return Uow.Movies.GetAll().OrderBy(s => s.MovieName); // regreso todas las peliculas basandome en el patrón Unit of Work 

            var model = Uow.Movies.GetAll()
                            .OrderByDescending(m => m.Reviews.Count())
                            .Select(m => new MovieViewModel
                            {
                                Id = m.Id,
                                MovieName = m.MovieName,
                                DirectorName = m.DirectorName,
                                ReleaseYear = m.ReleaseYear,
                                NoOfReviews = m.Reviews.Count(),
                               // Reviews = m.Reviews
                            });

            return model;
        }

        // GET: api/Movies/5
        public Movie Get(int id)
        {
            var movie = Uow.Movies.GetById(id);
            if (movie != null) return movie;

            throw new HttpResponseException(new HttpResponseMessage(HttpStatusCode.NotFound));     
        }

        // Actualiza una pelicula existente
        // POST: api/Movies
        public HttpResponseMessage Put([FromBody]Movie movie)
        {
            Uow.Movies.Update(movie);
            Uow.Commit();

            return new HttpResponseMessage(HttpStatusCode.NoContent);
        }

        //Crea una pelicula existente
        //POST: api/Movies
        public HttpResponseMessage Post(Movie movie)
        {
            Uow.Movies.Add(movie);
            Uow.Commit();

            var response = Request.CreateResponse(HttpStatusCode.Created, movie);

            return response;
        }

        // DELETE: api/Movies/5
        public HttpResponseMessage Delete(int id)
        {
            Uow.Movies.Delete(id);
            Uow.Commit();
            return new HttpResponseMessage(HttpStatusCode.NoContent);
        }
    }
}
