from splinter import Browser
from bs4 import BeautifulSoup
import pandas as pd


def init_browser():
    # @NOTE: Replace the path with your actual path to the chromedriver
    executable_path = {"executable_path": "chromedriver.exe"}
    return Browser("chrome", **executable_path, headless=False)


def scrape():
    browser = init_browser()
    # create surf_data dict that we can insert into mongo
    mars_data = {}

    #-----------------------------
    # Latest NEWS
    # ----------------------------

    # visit mars.nasa.gov/news
    url = 'http://mars.nasa.gov/news/'
    browser.visit(url)
    
    html = browser.html
    # Parse HTML with Beautiful Soup
    soup = BeautifulSoup(html, 'html.parser')
    # Retrieve all elements that contain news information
    slide = soup.find('li', class_='slide')
    
    # News Date
    list_date = slide.find('div', class_='list_date')
    mars_data["news_date"] = list_date.text.strip()
        
    # News Title
    content_title = slide.find('div', class_='content_title')
    mars_data["news_title"] = content_title.text.strip()
    link = content_title.find('a')
    mars_data["news_href"] = 'http://mars.nasa.gov' + link['href']
        
    #Paragraph Body
    teaser_body = slide.find('div', class_='article_teaser_body')
    mars_data["news_body"] = teaser_body.text.strip()
    
    #-----------------------------
    # Featured MARS image
    # ----------------------------
    
    
    # Collect information about the Featured Space Image
    url = 'https://www.jpl.nasa.gov/spaceimages/?search=&category=Mars'
    browser.visit(url)

    # HTML object
    html = browser.html
    # Parse HTML with Beautiful Soup
    soup = BeautifulSoup(html, 'html.parser')
    # Retrieve all elements that contain news information
    fancybox = soup.find('a', class_='button fancybox')
    data_link = 'https://www.jpl.nasa.gov'+ fancybox['data-link']


    # Use the ID and prepared the ling of the image to be collected
    data_link_id = data_link.split('?')[1]
    id_value = data_link_id.split("=")[1]
    img_url = f"https://photojournal.jpl.nasa.gov/jpeg/{id_value}.jpg"

    mars_data["feat_img_url"] = img_url


    #-----------------------------
    # Current weather on MARS
    # ----------------------------

    # Collect information about the Featured Space Image
    url = 'https://twitter.com/marswxreport?lang=en'
    browser.visit(url)

    # HTML object
    html = browser.html
    # Parse HTML with Beautiful Soup
    soup = BeautifulSoup(html, 'html.parser')
    # Retrieve all elements that contain tweets information
    stream_data = soup.find('div', class_='stream')
    stream_item = stream_data.find('li', class_='js-stream-item stream-item stream-item ')
    stream_text = stream_item.find('p', class_='TweetTextSize TweetTextSize--normal js-tweet-text tweet-text')
    mars_data["mars_weather"] = stream_text.text.strip()



    #-----------------------------
    # MARS Facts
    # ----------------------------

    url = 'https://space-facts.com/mars/'
    table = pd.read_html(url)
    df = table[0]
    df.columns = ['Fact', 'Value']
    df.set_index('Fact', inplace=True)
    df.index.name=None
    html_table = df.to_html()
    html_table = html_table.replace('\n', '')
    html_table = html_table.replace(' border="1" class="dataframe"', ' class="table table-sm table-bordered"')
    mars_data["facts"] = html_table


    #-----------------------------
    # MARS Hemispheres
    # ----------------------------

    # Collect information about the Featured Space Image
    url = 'https://astrogeology.usgs.gov/search/results?q=hemisphere+enhanced&k1=target&v1=Mars'
    browser.visit(url)

    # HTML object
    html = browser.html
    # Parse HTML with Beautiful Soup
    soup = BeautifulSoup(html, 'html.parser')
    # Retrieve all elements that contain news information
    product_section = soup.find('div', id='product-section')
    items = product_section.find_all('div', class_='item')


    hemisphere_images = []
    for item in items:
        link = item.find('a')
        image_url = 'https://astrogeology.usgs.gov' + link['href']
        
        title = item.find('h3')
        image_title = title.text.strip()
        title_list = image_title.split(" ")
        list_to_remove =['Enhanced']
        clean_name = list(set(title_list).difference(set(list_to_remove)))
        hemisphere_name = ' '.join(clean_name)

        browser.visit(image_url)

        # HTML object
        hemisphere_url = browser.html
        # Parse HTML with Beautiful Soup
        soup = BeautifulSoup(hemisphere_url, 'html.parser')
        # Retrieve all elements that contain news information
        target_image = soup.find('a', target='_blank')
        sample_image = target_image['href']
        
        
        # Store values in the dictionary
        hemisphere_images.append(
        {
            "title" : hemisphere_name,
            "img_url" : sample_image
        })

    mars_data["hemisphere_images"] = hemisphere_images




    browser.quit()
    return mars_data



