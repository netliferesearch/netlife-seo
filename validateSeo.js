function validateSeo(response) {
  
  // Check the length of the title
  let titleLength = response.title.length;

  // Check if the title length is within the desired range
  let passTitle = titleLength >= 50 && titleLength <= 60;

  // Check if the title length is within the warning range
  let warnTitle = titleLength < 50 || titleLength > 60;
  
  // Check the length of the description
  let descriptionLength = response.metaDescription.length;

  // Check if the description length is within the desired range
  let passDescription = descriptionLength >= 100 && descriptionLength <= 160;
  
  // Check if the description length is within the warning range
  let warnDescription = descriptionLength >= 50 && descriptionLength < 100;
  
  // Check if the canonical URL matches the current URL
  let urlCheck = response.canonicalUrl === response.currentUrl;
  
  // Check if the meta robots value is one of the allowed values
  let robotCheck = ['all', 'index, follow', 'index,follow' ].includes(response.metaRobots);

  // Check the word count
  let wordCount = response.wordCount;
  
  // Check if the word count is within the desired range
  let passWordCount = wordCount > 1000;

  // Check if the word count is within the warning range
  let warnWordCount = wordCount >= 200 && wordCount <= 1000;
    
  // Return the validation results
  return {
    title: {
      pass: passTitle,
      warn: warnTitle
    },
    description: {
      pass: passDescription,
      warn: warnDescription
    },
    url: urlCheck,
    robots: robotCheck,
    wordCount: {
      pass: passWordCount,
      warn: warnWordCount
    }      
    };
  }
  
// Export the validation function so it can be imported by other scripts
export default validateSeo;