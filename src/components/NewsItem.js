import React from 'react';

const NewsItem = (props)=> {

    const { title, description, imageUrl, newsUrl, author, date, time, source } = props;
    return (
      <div className='my-3'>
        <div className="card" style={{ position: 'relative' }}>
          <div style={{display:'flex',
            justifyContent:'flex-end',
            right:'0',
            position:'absolute'
          }}>
          <span 
                className="badge text-bg-danger" 
              >
                {source}
              </span>
          </div>
        
          <img src={imageUrl} className="card-img-top" alt="news" />
          <div className="card-body">
            <h5 className="card-title">
              {title}
              {/* Adjusted badge styles */}
             
            </h5>
            <p className="card-text">{description}</p>
            <p className="card-text">
              <small className="text-body-secondary">
                By {!author ? 'Unknown' : author} on {date} at {time}
              </small>
            </p> 
            <a href={newsUrl} target='_blank' rel="noopener noreferrer" className="btn btn-sm btn-dark">
              Read More
            </a>
          </div>
        </div>
      </div>
    );
  }

export default NewsItem;
