import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Sliders } from 'react-feather';
import { Popover, PopoverTrigger, PopoverContent } from "@heroui/popover";
import { IoFilterSharp } from "react-icons/io5";
import { FiShare2, FiCopy, FiX } from "react-icons/fi";
import axios from 'axios';
import { ENV_VAR } from './../../utils/envVariables';
import { toast } from 'sonner';
import { catalog } from '../../utils/data';
import PdfPreview from './PreviewPDFPage';
import { Slider } from "@heroui/react";
import HoverSwiper from './../common/Slider2';
import HoverVideo from '../common/HoverVideo';
import { MdOutlineOndemandVideo, MdSupportAgent } from "react-icons/md";
import { FiDownload } from "react-icons/fi";

const CatalogPage = () => {
  const location = useLocation();
  const [productData, setProductData] = useState({});
  const [categories, setCategories] = useState([]);
  const [activeMainCategory, setActiveMainCategory] = useState("");
  const [activeSubCategory, setActiveSubCategory] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [priceFilter, setPriceFilter] = useState({ min: 0, max: 0 });
  const [materialFilter, setMaterialFilter] = useState('all');
  const [sortOption, setSortOption] = useState('featured');
  const [showSort, setShowSort] = useState(false);
  const [shapeFilter, setShapeFilter] = useState('all');
  const [colorFilter, setColorFilter] = useState('all');
  const [moqFilter, setMoqFilter] = useState('all');
  const [formatFilter, setFormatFilter] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 0]);
  const [initialMaxPrice, setInitialMaxPrice] = useState(0);
  const [searchParam, setSearchParam] = useState('');
  const [colorOptions, setColorOptions] = useState([]);
  const [shapeOptions, setShapeOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mainCategoryId, setMainCategoryId] = useState(null);
  const [subCategoryId, setSubCategoryId] = useState(null);
  const [allItems, setAllItems] = useState([]);
  const [isPriceApply, setIsPriceApply] = useState(false);


  // Fetch categories and set initial category IDs
  const fetchCategories = async () => {
    try {
      const categoriesResponse = await axios.get(`${ENV_VAR.API_URL}/category`);
      const categoryData = categoriesResponse.data;
      setCategories(categoryData.data);


      const pathParts = location.pathname.split('/');
      const currentMainCategory = pathParts[2];
      const currentSubCategory = pathParts[3];
      if (currentMainCategory) {
        const mainCategory = categoryData.data.find(cat =>
          cat.name.toLowerCase() === currentMainCategory.toLowerCase()
        );

        if (mainCategory) {
          setMainCategoryId(mainCategory._id);
          setActiveMainCategory(currentMainCategory);

          if (currentSubCategory) {
            const subCategory = mainCategory.subcategories.find(sub =>
              sub.name.toLowerCase().replace(/\s+/g, '-') === currentSubCategory.toLowerCase()
            );

            if (subCategory) {
              setSubCategoryId(subCategory._id);
              setActiveSubCategory(currentSubCategory);
            }
          } else {
            setSubCategoryId(null);
            setActiveSubCategory('');
          }
        }
      }
    } catch (error) {
      console.log(error);

      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    }
  };

  // Fetch products based on current filters
  const fetchProducts = async () => {
    try {
      setIsLoading(true);

      const queryParams = new URLSearchParams(location.search);
      const searchId = queryParams.get('id');
      setSearchParam(searchId);

      const params = {
        category: mainCategoryId || undefined,
        subCategory: subCategoryId || undefined,
        material: materialFilter !== 'all' ? materialFilter : undefined,
        shape: shapeFilter !== 'all' ? shapeFilter : undefined,
        color: colorFilter !== 'all' ? colorFilter : undefined,
        moq: moqFilter !== 'all' ? moqFilter : undefined,
        format: formatFilter !== 'all' ? formatFilter : undefined,
        ...(isPriceApply && {
          minPrice: priceFilter.min,
          maxPrice: priceFilter.max,
        }),
        sort: sortOption,
        search: searchTerm || searchParam || undefined,
      };

      // Remove undefined params
      Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);

      const productsResponse = await axios.get(`${ENV_VAR.API_URL}/products`, { params });

      if (mainCategoryId) {
        // Category view - show products
        setAllItems(productsResponse.data.data || []);
        setFilteredItems(productsResponse.data.data || []);

        // Calculate max price for slider
        const maxPrice = (productsResponse.data.data || []).reduce(
          (max, item) => Math.max(max, item.price || 0), 0
        );        
        const roundedMax = Math.ceil(maxPrice / 1000) * 1000 || 10000;        
        if (priceFilter.max === 0) {
          setPriceRange([0, roundedMax]);
          setInitialMaxPrice(roundedMax);
        }
      } else {
        setProductData(productsResponse.data.data || {});
      }

    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch filter options (colors, shapes)
  const fetchFilterOptions = async () => {
    try {
      const [colorOptionsResponse, shapeOptionsResponse] = await Promise.all([
        axios.get(`${ENV_VAR.API_URL}/colors`),
        axios.get(`${ENV_VAR.API_URL}/shapes`)
      ]);
      setColorOptions(colorOptionsResponse.data.data);
      setShapeOptions(shapeOptionsResponse.data.data);
    } catch (error) {
      console.error("Error fetching filter options:", error);
    }
  };

  // Initial load
  useEffect(() => {
    const loadInitialData = async () => {
      resetFilters();
      await fetchCategories();
      await fetchFilterOptions();
      await fetchProducts();
    };
    loadInitialData();
  }, [location.pathname]);

  // Fetch products when filters or categories change
  useEffect(() => {
    const timer = setTimeout(() => {
      if (mainCategoryId !== null) { // Only fetch if we've loaded categories
        fetchProducts();
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [
    mainCategoryId,
    subCategoryId,
    // searchTerm,
    priceFilter,
    materialFilter,
    sortOption,
    shapeFilter,
    colorFilter,
    moqFilter,
    formatFilter
  ]);

  useEffect(() => {
    if (!searchTerm) {
      // If search is empty, show all items
      setFilteredItems(allItems);
      return;
    }

    // Filter from the complete list (allItems) every time
    const filtered = allItems.filter(item =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredItems(filtered);
  }, [searchTerm, allItems]);


  const getCategoryTitle = () => {
    if (!activeMainCategory) return 'All Products';

    const mainCategory = categories.find(cat =>
      cat.name.toLowerCase() === activeMainCategory.toLowerCase()
    );

    if (!mainCategory) return activeMainCategory;

    if (!activeSubCategory) return mainCategory.name;

    const subCategory = mainCategory.subcategories.find(sub =>
      sub.name.toLowerCase().replace(/\s+/g, '-') === activeSubCategory.toLowerCase()
    );

    return subCategory ? subCategory.name : activeSubCategory;
  };

  const resetFilters = () => {
    setPriceFilter({ min: 0, max: 0 });
    setPriceRange([0, 0]);
    setMaterialFilter('all');
    setSearchTerm('');
    setSortOption('featured');
    setShapeFilter('all');
    setColorFilter('all');
    setMoqFilter('all');
    setFormatFilter('all');
    setFilteredItems(allItems);
    setIsPriceApply(false);
  };

  const handlePriceApply = () => {
    setPriceFilter({
      min: priceRange[0],
      max: priceRange[1]
    });
    setIsPriceApply(true);
    setShowFilters(false);
  }

  const handleNavigate = (shortId) => {
    if (shortId) {
      window.open(`/view?pdf=${shortId}`, "_blank");
    }
  };

  const handleShare = (product, isInquiry) => {
    const phoneNumber = ENV_VAR.whatsappNumber;
    const baseUrl = ENV_VAR.FE_URL;
    const subCategory = product.subCategory.name.toLowerCase().replace(/\s+/g, '-');
    const productUrl = `${baseUrl}/catalog/${activeMainCategory}/${subCategory}?id=${product.title}`;

    const message = isInquiry ?
      `Hello 👋,

I am interested in this product and would like to inquire further. 🔍

📂 *Category:* ${product.category.name}  
📂 *Sub-Category:* ${product.subCategory.name}
🔖 *Product ID:* ${product.title}

🔗 *Product Link:* ${productUrl}


Thank you for your time. I look forward to your response. 🙏`
      :
      `Hello 👋,

I'm excited to share a product from *Nirmanam Graphics* that you might like! 🎨✨

*${product.category.name} ${product.subCategory.name}* 📌

🔗 *Product Link:* 
${productUrl} 

Check out our catalog for more amazing products! 🛍️

${baseUrl}/catalog/${activeMainCategory}/${subCategory}/`;

    const isMobile = /iPhone|Android/i.test(navigator.userAgent);
    if (isInquiry) {
      const url = isMobile
        ? `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`
        : `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
    }
    else {
      const url = isMobile
        ? `whatsapp://send?text=${encodeURIComponent(message)}`
        : `https://web.whatsapp.com/send?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
    }
  };


  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-DarkBlue"></div>
      </div>
    );
  }

  return (
    activeMainCategory ? (
      <div className="p-5 max-w-7xl mx-auto">
        <h2 className="mb-5 text-2xl font-semibold text-DarkBlue">
          {getCategoryTitle()}
        </h2>

        <div className="flex flex-col gap-5">
          <div className="flex items-center mb-5">
            <div className="flex gap-3 w-full">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-1/3 p-2 border border-gray-300 rounded"
              />
              <Popover className='shadow-lg rounded-2xl' placement={window.innerWidth < 640 ? "bottom" : "right"} isOpen={showFilters} onOpenChange={(open) => setShowFilters(open)}>
                <PopoverTrigger>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-2 px-4 py-2 rounded cursor-pointer  ${showFilters ? 'bg-DarkBlue border-DarkBlue text-white' : 'bg-gray-100 text-gray-800'
                      }`}
                  >
                    <Sliders size={16} />
                    Filters
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-[90vw] max-w-[450px]">
                  {showFilters && (
                    <div className="w-full px-4">
                      <div className="w-full rounded-xl  bg-white p-2 flex flex-col gap-4">
                        {/* Price Filter - full width */}
                        <div className='flex gap-2'>
                          <Slider
                            className="w-full"
                            value={priceRange}
                            onChange={(value) => setPriceRange(value)}
                            formatOptions={{ style: "currency", currency: "inr" }}
                            label="Price Range"
                            maxValue={initialMaxPrice}
                            minValue={0}
                            step={100}
                          />
                          <button
                            onClick={handlePriceApply}
                            className="mt-3 w-fit bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors text-sm font-medium"
                          >
                            Apply
                          </button>
                        </div>

                        {/* Filters Grid (2 columns) */}
                        <div className="grid grid-cols-2 gap-4 w-full">
                          {/* MOQ Filter */}
                          {(activeMainCategory === 'graphics' || activeMainCategory === 'gifting') && (
                            <div>
                              <h5 className="mb-2 text-sm font-medium">MOQ</h5>
                              <select
                                value={moqFilter}
                                onChange={(e) => setMoqFilter(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded"
                              >
                                <option value="all">Any MOQ</option>
                                <option value="1-10">1-10</option>
                                <option value="10-50">10-50</option>
                                <option value="50-100">50-100</option>
                                <option value="100+">100+</option>
                              </select>
                            </div>
                          )}

                          {/* Material Filter */}
                          {((activeMainCategory === 'graphics' && ['wedding-cards', 'invitation-card'].includes(activeSubCategory)) || activeMainCategory === 'gifting') && (
                            <div>
                              <h5 className="mb-2 text-sm font-medium">Material</h5>
                              <select
                                value={materialFilter}
                                onChange={(e) => setMaterialFilter(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded"
                              >
                                <option value="all">All Materials</option>
                                {[...new Set(filteredItems.map(item => item.material).filter(Boolean))].map(material => (
                                  <option key={material} value={material}>{material}</option>
                                ))}
                              </select>
                            </div>
                          )}

                          {/* Shape Filter */}
                          {((activeMainCategory === 'graphics' && ['wedding-cards', 'invitation-card'].includes(activeSubCategory)) || activeMainCategory === 'gifting') && (
                            <div>
                              <h5 className="mb-2 text-sm font-medium">Shape</h5>
                              <select
                                value={shapeFilter}
                                onChange={(e) => setShapeFilter(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded"
                              >
                                <option value="all">All Shapes</option>
                                {shapeOptions.map(shape => (
                                  <option key={shape._id} value={shape.name.toLowerCase()}>{shape.name}</option>
                                ))}
                              </select>
                            </div>
                          )}

                          {/* Color Filter */}
                          {(activeMainCategory === 'graphics' && ['wedding-cards', 'invitation-card'].includes(activeSubCategory)) ||
                            (activeMainCategory === 'gifting' && ['gift-cover'].includes(activeSubCategory)) ? (
                            <div>
                              <h5 className="mb-2 text-sm font-medium">Color</h5>
                              <select
                                value={colorFilter}
                                onChange={(e) => setColorFilter(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded"
                              >
                                <option value="all">All Colors</option>
                                {colorOptions.map(color => (
                                  <option key={color._id} value={color.name.toLowerCase()}>{color.name}</option>
                                ))}
                              </select>
                            </div>
                          ) : null}
                        </div>

                        {/* Digital Format Filter */}
                        {activeMainCategory === 'digital' && (
                          <div>
                            <h5 className="mb-2 text-sm font-medium">Type</h5>
                            <select
                              value={formatFilter}
                              onChange={(e) => {
                                setFormatFilter(e.target.value)
                              }}
                              className="w-full p-2 border border-gray-300 rounded"
                            >
                              <option value="all">All Type</option>
                              <option value="pdf">PDF</option>
                              <option value="video">Video</option>
                            </select>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </PopoverContent>
              </Popover>
              {
                (isPriceApply || materialFilter !== 'all' || searchTerm ||
                  shapeFilter !== 'all' || colorFilter !== 'all' || moqFilter !== 'all' || formatFilter !== 'all') && (
                  <p
                    onClick={resetFilters}
                    className="text-red-500 cursor-pointer flex justify-center items-center font-bold"
                  >
                    X
                  </p>
                )
              }
            </div>
            {filteredItems.length > 0 && (
              <Popover placement='bottom' open={showSort} onOpenChange={(isOpen) => setShowSort(isOpen)}>
                <PopoverTrigger>
                  <button className="p-2 rounded hover:bg-gray-100">
                    <IoFilterSharp size={20} />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="min-w-[250px] p-4 shadow-lg rounded-2xl z-50 ">
                  {[
                    { label: "Featured", value: "featured" },
                    { label: "Price: Low to High", value: "price-low" },
                    { label: "Price: High to Low", value: "price-high" },
                  ].map((option, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setShowSort(false);
                        setSortOption(option.value);
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-200 rounded text-DarkBlue  ${sortOption === option.value ? "bg-gray-200" : ""}`}
                    >
                      {option.label}
                    </button>
                  ))}
                </PopoverContent>
              </Popover>
            )}
          </div>

          {/* Products Grid */}
          <div>
            {filteredItems.length > 0 ? (
              // <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-5  space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {filteredItems.map(item => (
                  <div
                    key={item._id}
                    className="group break-inside-avoid border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white cursor-pointer"
                  >
                    <div className="relative" onContextMenu={(e) => e.preventDefault()}>
                      {item.image?.length > 0 && !item.video ? (
                        <div className="w-full relative">
                          <HoverSwiper slides={item.image.map(img => img.url)} />
                        </div>
                      ) : item.pdf ? (
                        <div className="w-full flex justify-center border-b-1" onClick={() => handleNavigate(item.pdf.short)}>
                          <PdfPreview
                            pdfUrl={item.pdf.url}
                            totalPages={item.pdf.totalPages}
                          />
                        </div>
                      ) : item.video ? (
                        <div className="w-full relative group"
                          onClick={() => window.open(item.video.url, "_blank")}
                        >
                          <HoverVideo
                            videoUrl={item.video.url}
                            posterUrl={item.image?.[0]?.url}
                          />
                        </div>
                      ) : (
                        <div className="text-center text-gray-500 p-4">
                          No media available
                        </div>
                      )}

                      <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-0.5 rounded text-sm font-bold z-10">
                        ₹{item.price}
                      </div>

                      <div className="absolute top-2 right-2 flex gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-400">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShare(item, false);
                          }}
                          className="shadow-lg p-2 bg-black/70 text-white hover:bg-black/80 rounded-full z-10"
                          title="Share"
                        >
                          <FiShare2 size={16} />
                        </button>
                        {(item.pdf || item.video) && (
                          <button
                            onClick={async (e) => {
                              e.stopPropagation();
                              if (item.pdf) {
                                try {
                                  const response = await fetch(`${item.pdf.url}?fl_attachment&quality=0`);
                                  const blob = await response.blob();
                                  const url = window.URL.createObjectURL(blob);
                                  const link = document.createElement('a');
                                  link.href = url;
                                  link.download = `${item.title.replace(/[^a-z0-9]/gi, '_')}.pdf`;
                                  link.style.display = 'none';
                                  document.body.appendChild(link);
                                  link.click();
                                  window.URL.revokeObjectURL(url);
                                  document.body.removeChild(link);
                                  toast.success(`PDF download started`);
                                } catch (error) {
                                  toast.error('Failed to download PDF');
                                  console.error('Download error:', error);
                                }
                              }
                              else if (item.video) {
                                try {
                                  const response = await fetch(`${item.video.url}?fl_attachment`);
                                  const blob = await response.blob();
                                  const url = window.URL.createObjectURL(blob);
                                  const link = document.createElement('a');
                                  link.href = url;
                                  link.download = `${item.title.replace(/[^a-z0-9]/gi, '_')}.mp4` || 'download.mp4';
                                  link.style.display = 'none';
                                  document.body.appendChild(link);
                                  link.click();
                                  window.URL.revokeObjectURL(url);
                                  document.body.removeChild(link);
                                  toast.success(`Video download started`);
                                } catch (error) {
                                  toast.error('Failed to download video');
                                  console.error('Download error:', error);
                                }
                              }
                            }}
                            className="shadow-lg p-2 bg-black/70 text-white hover:bg-black/80 rounded-full z-10"
                            title="Download"
                          >
                            <FiDownload size={16} />
                          </button>
                        )}

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShare(item, true);
                          }}
                          className="shadow-lg p-2 bg-black/70 text-white hover:bg-black/80 rounded-full z-10"
                          title="Inquiry"
                        >
                          <MdSupportAgent size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="p-3">
                      <h3 className="text-sm font-medium mb-1 truncate w-48" title={item.title}>{item.title}</h3>
                      {item.size && <p className="text-xs text-gray-600">Size: {item.size}</p>}
                      {item.material && <p className="text-xs text-gray-600">Material: {item.material}</p>}
                      {item.type && <p className="text-xs text-gray-600">Type: {item.type}</p>}
                      {item.moq && <p className="text-xs text-gray-600" title='Minimum Order Quantity'><span className='font-bold'>MOQ:</span> {item.moq}</p>}
                      {item.description && <p className="text-xs text-gray-600" title='Minimum Order Quantity'>{item.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 border border-dashed border-gray-300 rounded-lg">
                <h4 className="mb-2 text-lg font-medium">No products found</h4>
                <p className="text-gray-600">Try adjusting your search or filter criteria</p>
                <button
                  onClick={resetFilters}
                  className="mt-4 px-4 py-2 bg-Darkborder-DarkBlue text-gray-400 rounded cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    ) : (
      <div className="py-10 text-gray-800 px-[8%] mt-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {catalog.map((category, index) => (
            <a
              href={`/catalog/${category.route}`}
              key={index}
              className="rounded-3xl overflow-hidden text-center hover:shadow-xl transition duration-300 cursor-pointer"
            >
              <img
                src={`/assets/images/Resourse Photo/r${index + 1}.png`}
                alt={category.name}
                className="w-full h-auto max-h-48 object-cover md:max-h-[300px] sm:max-h-[200px]"
              />
            </a>
          ))}
        </div>
      </div>
    )
  );
};

export default CatalogPage;