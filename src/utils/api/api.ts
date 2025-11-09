/* eslint-disable @typescript-eslint/no-explicit-any */

export const getAllPackage = async (params: Record<string, any> = {}) => {
  try {
    // Remove empty or undefined paramss
    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, value]) => value !== "" && value !== null && value !== undefined
      )
    );

    // Always keep a valid `page` (default to 1)
    const finalParams = {
      page: String(filteredParams.page || 1),
      ...Object.fromEntries(
        Object.entries(filteredParams).map(([key, value]) => [key, String(value)])
      ),
    };

    // Build query string
    const query = new URLSearchParams(finalParams).toString();

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/package/allPackage?${query}`,
      {
        next: { revalidate: 3600 },
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch packages: ${res.statusText}`);
    }

    const data = await res.json();

    return {
      meta: data?.data?.meta || {},
      result: data?.data?.result || [],
    };
  } catch (error) {
    console.error("Error fetching packages:", error);
    return { meta: {}, result: [] };
  }
};



export const getSinglePackage = async (id:any) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/package/single-package/${id}`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      throw new Error('Failed to fetch events');
    }

    const data = await res.json();
    
    // Return both the meta and result data
    return data
  } catch (error) {
    console.error("Error fetching events:", error);
    return { meta: {}, result: [] }; // Return empty meta and result in case of error
  }
};
export const getSingleBlog = async (id:any) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/blog/single-blog/${id}`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      throw new Error('Failed to fetch events');
    }

    const data = await res.json();
    
    // Return both the meta and result data
    return data
  } catch (error) {
    console.error("Error fetching events:", error);
    return { meta: {}, result: [] }; // Return empty meta and result in case of error
  }
};

export const getAllEvents = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/event/allEvents`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      throw new Error('Failed to fetch events');
    }

    const data = await res.json();
    // Return both the meta and result data
    return {
      meta: data?.data?.meta || {},
      result: data?.data?.result || [],
    };
  } catch (error) {
    console.error("Error fetching events:", error);
    return { meta: {}, result: [] }; // Return empty meta and result in case of error
  }
};
export const getAllOptions = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/transferOption/allOptions`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      throw new Error('Failed to fetch events');
    }

    const data = await res.json();
    // Return both the meta and result data
    return {
      meta: data?.data?.meta || {},
      result: data?.data?.result || [],
    };
  } catch (error) {
    console.error("Error fetching events:", error);
    return { meta: {}, result: [] }; // Return empty meta and result in case of error
  }
};

export const getAllFaq = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/faq/allFaq`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      throw new Error('Failed to fetch FAQ');
    }

    const data = await res.json();
    // Return both the meta and result data
    return {
      meta: data?.data?.meta || {},
      result: data?.data?.result || [],
    };
  } catch (error) {
    console.error("Error fetching FAQ:", error);
    return { meta: {}, result: [] }; // Return empty meta and result in case of error
  }
};
