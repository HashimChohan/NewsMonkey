import React, { useEffect, useState } from 'react';
import NewsItem from './NewsItem';
import Spinner from './Spinner';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';

const News = (props) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  useEffect(() => {
    fetchNews();
    document.title = `NewsMonkey - Top ${capitalizeFirstLetter(props.category)} Headlines`;
    // eslint-disable-next-line
  }, [props.category]);

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const fetchNews = async () => {
    props.setProgress(0);
    setLoading(true);
    props.setProgress(10);
    try {
      props.setProgress(30);
      let url = `https://newsapi.org/v2/everything?q=${props.category}&language=en&sortBy=publishedAt&apiKey=eaf92a8797674b5a90a5e11ca1326331&page=${page}&pageSize=${props.pageSize}`;
      let data = await fetch(url);
      props.setProgress(50);
      let parsedData = await data.json();
      props.setProgress(70);
      setArticles(parsedData.articles || []);
      setTotalResults(parsedData.totalResults || 0);
      setLoading(false);

      props.setProgress(100);
    } catch (error) {
      console.error("Error fetching news:", error);
      setLoading(false);
    }
  };

  const fetchMoreData = async () => {
    const newPage = page + 1;
    setPage(newPage);
    try {
      let url = `https://newsapi.org/v2/everything?q=${props.category}&language=en&sortBy=publishedAt&apiKey=eaf92a8797674b5a90a5e11ca1326331&page=${newPage}&pageSize=${props.pageSize}`;
      let data = await fetch(url);
      let parsedData = await data.json();

      setArticles((prevArticles) => prevArticles.concat(parsedData.articles || []));
      setTotalResults(parsedData.totalResults || 0);
    } catch (error) {
      console.error("Error fetching more data:", error);
    }
  };

  return (
    <div className='container my-3'>
      <h1 className="text-center" style={{marginTop:'90px'}}>
        NewsMonkey - Top {capitalizeFirstLetter(props.category)} Headlines
      </h1>
      {loading && <Spinner />}
      <InfiniteScroll
        dataLength={articles.length}
        next={fetchMoreData}
        hasMore={articles.length < totalResults}
        loader={<Spinner />}
      >
        <div className="row">
          {articles.map((element) => {
            const defaultImage = "https://static.toiimg.com/thumb/imgsize-23456,msid-112905487,width-375,resizemode-4/112905487.jpg";
            const imageUrl = element.urlToImage ? element.urlToImage : defaultImage;

            // Format the published date and time
            const formattedDate = new Date(element.publishedAt).toDateString();
            const formattedTime = new Date(element.publishedAt).toLocaleTimeString();

            return (
              <div className="col-md-3" key={element.url}>
                <NewsItem
                  title={element.title || ""}
                  description={element.description || ""}
                  imageUrl={imageUrl}
                  newsUrl={element.url || ""}
                  author={element.author}
                  date={formattedDate}
                  time={formattedTime}
                  source={element.source.name || "Unknown"}
                />
              </div>
            );
          })}
        </div>
      </InfiniteScroll>
    </div>
  );
};

News.defaultProps = {
  country: 'in',
  pageSize: 5,
  category: 'general',
};

News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
  setProgress: PropTypes.func.isRequired,
};

export default News;
