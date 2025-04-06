import React from 'react';

const Profilebio = ({ currentprofile = {} }) => {
  // default tags to an empty array, about to an empty string
  const tags = currentprofile.tags || [];
  const about = currentprofile.about || '';

  return (
    <div className="profile-bio">
      <div className="profile-tags">
        {tags.length > 0 ? (
          <>
            <h4>Tags watched</h4>
            {tags.map(tag => (
              <p key={tag}>{tag}</p>
            ))}
          </>
        ) : (
          <p>0 Tags watched</p>
        )}
      </div>

      <div className="profile-about">
        {about ? (
          <>
            <h4>About</h4>
            <p>{about}</p>
          </>
        ) : (
          <p>No bio found</p>
        )}
      </div>
    </div>
  );
};

export default Profilebio;
