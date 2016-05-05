[assembly: WebActivatorEx.PreApplicationStartMethod(typeof(MovieReview.Web.App_Start.NinjectWebCommon), "Start")]
[assembly: WebActivatorEx.ApplicationShutdownMethodAttribute(typeof(MovieReview.Web.App_Start.NinjectWebCommon), "Stop")]

namespace MovieReview.Web.App_Start
{
    using System;
    using System.Web;
    using System.Web.Http;
    using Microsoft.Web.Infrastructure.DynamicModuleHelper;
    using MovieReview.Data;
    using MovieReview.Data.Contracts;
    using Ninject;
    using Ninject.Web.Common;
    using WebApiContrib.IoC.Ninject;

    public static class NinjectWebCommon 
    {
        private static readonly Bootstrapper bootstrapper = new Bootstrapper();

        /// <summary>
        /// Starts the application
        /// </summary>
        public static void Start() 
        {
            DynamicModuleUtility.RegisterModule(typeof(OnePerRequestHttpModule));
            DynamicModuleUtility.RegisterModule(typeof(NinjectHttpModule));
            bootstrapper.Initialize(CreateKernel);
        }
        
        /// <summary>
        /// Stops the application.
        /// </summary>
        public static void Stop()
        {
            bootstrapper.ShutDown();
        }
        
        /// <summary>
        /// Creates the kernel that will manage your application.
        /// </summary>
        /// <returns>The created kernel.</returns>
        private static IKernel CreateKernel()
        {
            var kernel = new StandardKernel();
            try
            {
                kernel.Bind<Func<IKernel>>().ToMethod(ctx => () => new Bootstrapper().Kernel);
                kernel.Bind<IHttpModule>().To<HttpApplicationInitializationHttpModule>();

                //aqui pongo los web api settings
                GlobalConfiguration.Configuration.DependencyResolver = new NinjectResolver(kernel);
                
                RegisterServices(kernel);
                return kernel;
            }
            catch
            {
                kernel.Dispose();
                throw;
            }
        }

        /// <summary>
        /// Load your modules or register your services here!
        /// </summary>
        /// <param name="kernel">The kernel.</param>
        private static void RegisterServices(IKernel kernel)
        {
            // aqui menciono todas mis dependencias 
            kernel.Bind<RepositoryFactories>().To<RepositoryFactories>().InSingletonScope();


            kernel.Bind<IRepositoryProvider>().To<RepositoryProvider>();
            kernel.Bind<IMovieReviewUow>().To<MovieReviewUow>();
        }        
    }
}
