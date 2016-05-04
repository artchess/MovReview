using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
namespace MovieReview.Model
{
    public class MoviesReview
    {
        public int Id { get; set; }
        public string ReviewerName { get; set; }
        public string ReviewerComments { get; set; }
        public int ReviewerRating { get; set; }
        public int MovieId { get; set; }
    }
}
