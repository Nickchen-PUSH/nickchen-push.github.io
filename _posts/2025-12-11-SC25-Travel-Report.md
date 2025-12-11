---
layout: post
title: My trip report | SC25@St. Louis
date: 2025-10-22 10:00:00 +0800
description: My trip report of SC25@St. Louis 🇺🇸 # Add post description (optional)
img: GatewayArch.jpeg # Add image post (optional)
fig-caption: # Add figcaption (optional)
tags: [blog,Trip Report,StLouis,SC25]
---
# SC25 Travel Report

# **Introduction**

This report provides an overview of my experience attending SC25 in St. Louis, USA.


## **Conference Experience**

The SC conference is the premier international venue for high-performance computing (HPC), networking, storage, and data analysis. It brings together researchers, practitioners, and industry leaders to present the latest breakthroughs and innovations. The program includes technical sessions, workshops, tutorials, panel discussions, and a large exhibition showcasing cutting-edge technologies and products from top organizations across the HPC ecosystem.

## **Keynote Highlights**

The SC25 keynote was delivered by Thomas Koulopoulos, a futurist and author known for his forward-looking perspectives on technology’s role in shaping society. His talk, “Gigatrends: The Exponential Forces Shaping Our Digital Future,” examined the transformative technological and societal forces steering our world. An engaging and dynamic speaker, Koulopoulos offered a thought-provoking and optimistic outlook that left a lasting impression on me.

<!-- <center>
    <img style="border-radius: 0.3125em;
    box-shadow: 0 2px 4px 0 rgba(34,36,38,.12),0 2px 10px 0 rgba(34,36,38,.08);" 
    src="../assets/photos/WuHan-PavanBalaji.jpg" width = "65%" alt=""/>
    <br>
    <div style="color:orange; border-bottom: 1px solid #d9d9d9;
    display: inline-block;
    color: #999;
    padding: 2px;">
      与Pavan Balaj博士（左二）合影
  	</div>
</center> -->

<!-- ![Keynote](SC25%20Travel%20Report/70ED22FF-0C45-4768-B690-854AD4DDD6D3_1_105_c.jpeg) -->

<center>
    <img style="border-radius: 0.3125em;
    box-shadow: 0 2px 4px 0 rgba(34,36,38,.12),0 2px 10px 0 rgba(34,36,38,.08);" 
    src="SC25%20Travel%20Report/70ED22FF-0C45-4768-B690-854AD4DDD6D3_1_105_c.jpeg" width = "65%" alt=""/>
    <br>
    <div style="color:orange; border-bottom: 1px solid #d9d9d9;
    display: inline-block;
    color: #999;
    padding: 2px;">
      Keynote Speaker Thomas Koulopoulos
  	</div>
</center>

Before the keynote, Ms. Lori Diachin, the SC25 Chair, provided an overview of this year’s conference. She reflected on her long-standing involvement with the HPC community and the SC series. Her dedication and enthusiasm were evident, setting an inspiring tone for the week. I was deeply encouraged by her commitment to advancing the field and supporting the community.

## **Academic Insights**

The SC conference is widely recognized for its strong technical program, offering a rich collection of paper presentations, workshops, tutorials, and panel discussions. As an enthusiastic learner, I attended several sessions that aligned closely with my research interests.

<!-- ![Me at SC25.jpeg](SC25%20Travel%20Report/me-at-sc25.jpeg) -->

<center>
    <img style="border-radius: 0.3125em;
    box-shadow: 0 2px 4px 0 rgba(34,36,38,.12),0 2px 10px 0 rgba(34,36,38,.08);" 
    src="SC25%20Travel%20Report/me-at-sc25.jpeg" width = "65%" alt=""/>
    <br>
    <div style="color:orange; border-bottom: 1px solid #d9d9d9;
    display: inline-block;
    color: #999;
    padding: 2px;">
      Me at SC25
  	</div>
</center>

### **Containerization and Software Deployment**

In this paper session, my presentation of coMtainer at SC25 received encouraging feedback from the audience. Many attendees expressed strong interest in its technical design and implementation details. I was also surprised to find a closely related work in the same session: XaaS Containers, presented by Torsten Hoefler from ETH Zurich. These two works share similar motivations and goals, both aiming to improve the adaptability and performance portability of containerized applications in HPC environments. This shows that the research direction of enhancing container adaptability is gaining traction in the HPC community.

### **Quantum Computing**

On Wednesday, I attended a panel session titiled "The Quantum Era of HPC: Roadmaps, Challenges, and Opportunities in Navigating the Integration Frontier". The panel featured experts from academia, industry, and national laboratories discussing the current state and future prospects of quantum computing in HPC. The panelists highlighted current and potential applications of quantum computing, such as high quality random number generation, molecular simulations, and optimization problems. However, they also acknowledged that current quantum computing is useless. It is still a very important problem to discover "quantum advantage" and build practical quantum computers that can outperform classical computers for specific tasks.

Regarding integration with HPC systems, the panel stressed the importance of hardware–software co-design, robust error mitigation, and the development of new hybrid algorithms. They repeatedly emphasized that collaboration across disciplines and institutions will be essential to unlocking meaningful progress in quantum-accelerated HPC.

### **MPI 5.0**

Birds of a Feather (BoF) sessions are a valuable part of the SC experience, offering a space for open discussions on focused topics. I attended the BoF on MPI 5.0, where members of the MPI Forum introduced key features and improvements in the upcoming standard.

One highlight was the introduction of Application Binary Interface (ABI) compatibility. From my understanding, ABI support in MPI 5.0 means that applications compiled against different MPI implementations will be able to interoperate without recompilation. This represents a major step forward in portability and flexibility, allowing developers to select the most suitable MPI implementation without being constrained by binary compatibility issues.

What impressed me most was the Forum’s openness and collaborative spirit. The MPI developers not only presented their progress but also actively invited community feedback and encouraged broader participation in shaping future versions of MPI. It was remarkable to be in the same room with the people who design, implement, and maintain such a foundational technology for HPC.

### **AI's Impact on HPC**

As a rapidly evolving field, AI has a profound impact on HPC. I came acrossed multiple fresh ideas regarding the intersection of AI and HPC during the conference.

- Around the world, new supercomputers are designed as AI-ready systems, capable of supporting the intensive demands of both AI and traditional HPC workloads—reflecting trends we have also observed in our home centers.
- Some research efforts focus on using HPC systems to train large-scale reasoning models. Understanding the challenges and workload characteristics of training such models can inform the design of future AI-optimized supercomputers, and can publish a paper in SC conference.
- Using simulation data to augment real-world data for training AI models is a promising approach. This technique can help overcome the limitations of real-world data, such as scarcity or bias, and improve the performance and generalization of AI models.


## **Student@SC Program**

As a participant of the Student@SC program, I had the opportunity to engage in various activities designed to enhance my conference experience and professional development.

### **Resume and Portfolio Workshop**

As part of Student@SC program, the Resume and Portfolio Workshop host by Marisol Gamboa gave me invaluable insights into crafting a compelling resume and portfolio. Ms. Gamboa is an experienced workforce manager in Lawence Livermore National Laboratory, and her advice on tailoring resumes and CVs reflected the expectations of employers in the HPC field.

In her talk, she emphasized the importance of clarity, conciseness, and relevance in resumes. She advised us to carefully review the job postings and identify the key skills, qualifications, and experiences the employer is seeking. "It's your duty to make it easy for the hiring manager to see that you are a perfect fit for the role," she said. She also highlighted the significance of quantifying achievements and using action verbs to describe experiences.

Detail tips can be found in [here](https://students-sc.github.io/workshops/), the website consists slides and cheat sheets for crafting good resumes and portfolios.

During the workshop, I'm fortunate to have met with several peers who are also passionate about HPC. We came from different stages of our academic and professional journeys, and we had great conversations about our experiences and aspirations in the field. We formed a lunch group and exchanged contact information to stay connected. It was so exciting to meet new friends across the globe who share the same passion for HPC.

One thing I learned from my new friends is the importance of visibility and networking in the community. Many of them have complete detailed LinkedIn profiles, personal websites, and GitHub repositories showcasing their projects and contributions. These online platforms serve as a portfolio for potential employers and collaborators to explore their work, and help them stand out in a competitive job market. Selling one's work is as important as doing the work itself. Visibility is key to success in the field.

<!-- ![My new friends](SC25%20Travel%20Report/1F261024-7C2F-4487-9620-325CCD6D5704_1_105_c.jpeg) -->

<center>
    <img style="border-radius: 0.3125em;
    box-shadow: 0 2px 4px 0 rgba(34,36,38,.12),0 2px 10px 0 rgba(34,36,38,.08);" 
    src="SC25%20Travel%20Report/1F261024-7C2F-4487-9620-325CCD6D5704_1_105_c.jpeg" width = "65%" alt=""/>
    <br>
    <div style="color:orange; border-bottom: 1px solid #d9d9d9;
    display: inline-block;
    color: #999;
    padding: 2px;">
      My new friends
  	</div>
</center>


### **Mentor and Protégé Program**

Mentor and Protégé Program is another exciting opportunity that supports the growth of a vibrant HPC community by connecting students with experienced mentors. During the program, I was paired with Mr. Trey White, a distinguished research scientist at Oak Ridge National Laboratory. He has a very interesting career path, starting as a computational scientist, then transitioning to a software engineer in DreamWorks Animation, and finally returning to HPC as a research scientist. His diverse experiences have given him a unique perspective on the field. He shared with me his insights on career development and his thoughts on the current situation. He also provided valuable advice on navigating the SC conference and making the most of the opportunities available. I truly appreciate his opinions and guidance from different points of view.

<!-- ![My SC25 Mentor Mr. Trey White](SC25%20Travel%20Report/615157E6-46B0-4618-94C5-F4DEA8527C5A_1_105_c.jpeg) -->

<center>
    <img style="border-radius: 0.3125em;
    box-shadow: 0 2px 4px 0 rgba(34,36,38,.12),0 2px 10px 0 rgba(34,36,38,.08);" 
    src="SC25%20Travel%20Report/615157E6-46B0-4618-94C5-F4DEA8527C5A_1_105_c.jpeg" width = "65%" alt=""/>
    <br>
    <div style="color:orange; border-bottom: 1px solid #d9d9d9;
    display: inline-block;
    color: #999;
    padding: 2px;">
      My SC25 Mentor Mr. Trey White
  	</div>
</center>



## **Journey to the West**

The moment I stepped off the San Francisco airport, a cold, sharp autumn wind beat me, as it struck the bell of my grand adventure ahead. A land once admired as the land of opportunities, a land of dreams but also a land of questions and doubts, mist of uncertainties. Ahead, what awaits me? This journey shall unfold the answers.

<!-- ![Arriving in United States.jpeg](SC25%20Travel%20Report/A941872F-B11D-40FD-884D-F8F50B3C1B36_1_105_c.jpeg) -->

<center>
    <img style="border-radius: 0.3125em;
    box-shadow: 0 2px 4px 0 rgba(34,36,38,.12),0 2px 10px 0 rgba(34,36,38,.08);" 
    src="SC25%20Travel%20Report/A941872F-B11D-40FD-884D-F8F50B3C1B36_1_105_c.jpeg" width = "65%" alt=""/>
    <br>
    <div style="color:orange; border-bottom: 1px solid #d9d9d9;
    display: inline-block;
    color: #999;
    padding: 2px;">
      Arriving in United States
  	</div>
</center>

### **St. Louis**

St. Louis, founded in 1764 by French fur traders, is known as the “Gateway to the West.” In the 19th and early 20th centuries, it thrived as a major center for trade and transportation, even hosting the 1904 Olympic Games. The magnificent 630-foot Gateway Arch stands as a testament to the city’s historic role in America’s westward expansion.

Yet the St. Louis I encountered was a city of contrasts. The gleaming Arch rises proudly over the west bank of the Mississippi River, while its shadow falls upon neighborhoods still grappling with the challenges of economic decline, population loss, and complex social issues. Walking through parts of the downtown area, I found the streets quiet and subdued, the air tinged with the scent of burning grass, as if carrying traces of long-forgotten stories.

<!-- ![The Arch](SC25%20Travel%20Report/9BEF59FD-A52C-448E-8F78-AF03168511B0_1_105_c.jpeg) -->

<center>
    <img style="border-radius: 0.3125em;
    box-shadow: 0 2px 4px 0 rgba(34,36,38,.12),0 2px 10px 0 rgba(34,36,38,.08);" 
    src="SC25%20Travel%20Report/9BEF59FD-A52C-448E-8F78-AF03168511B0_1_105_c.jpeg" width = "65%" alt=""/>
    <br>
    <div style="color:orange; border-bottom: 1px solid #d9d9d9;
    display: inline-block;
    color: #999;
    padding: 2px;">
      The Arch
  	</div>
</center>


<!-- ![Washington Avenue](SC25%20Travel%20Report/D6A22693-6DD0-4135-8336-B4A9089A24C5_1_105_c.jpeg) -->

<center>
    <img style="border-radius: 0.3125em;
    box-shadow: 0 2px 4px 0 rgba(34,36,38,.12),0 2px 10px 0 rgba(34,36,38,.08);" 
    src="SC25%20Travel%20Report/D6A22693-6DD0-4135-8336-B4A9089A24C5_1_105_c.jpeg" width = "65%" alt=""/>
    <br>
    <div style="color:orange; border-bottom: 1px solid #d9d9d9;
    display: inline-block;
    color: #999;
    padding: 2px;">
      Washington Avenue
  	</div>
</center>

Washington Avenue


On clear days, visitors can ride the tram to the top of the Arch, where sweeping views of the city and the Mississippi unfold beneath the sky. Across the river lies East St. Louis, and from above, the sharp contrast between the two sides becomes even more evident.

<center>
    <img style="border-radius: 0.3125em;
    box-shadow: 0 2px 4px 0 rgba(34,36,38,.12),0 2px 10px 0 rgba(34,36,38,.08);" 
    src="SC25%20Travel%20Report/D0823D98-720F-4A25-8101-4FFD81B3F793_1_105_c.jpeg" width = "65%" alt=""/>
    <br>
    <div style="color:orange; border-bottom: 1px solid #d9d9d9;
    display: inline-block;
    color: #999;
    padding: 2px;">
      Downtown St. Louis
    </div>
</center>

<center>
    <img style="border-radius: 0.3125em;
    box-shadow: 0 2px 4px 0 rgba(34,36,38,.12),0 2px 10px 0 rgba(34,36,38,.08);" 
    src="SC25%20Travel%20Report/866F1736-13CE-4820-89EC-E6FC7F808F50_1_105_c.jpeg" width = "65%" alt=""/>
    <br>
    <div style="color:orange; border-bottom: 1px solid #d9d9d9;
    display: inline-block;
    color: #999;
    padding: 2px;">
      East St. Louis
    </div>
</center>


Because of late travel arrangements, I stayed in an Airbnb in the Gate District, about a 20-minute drive from the convention center. Despite initial worries, the neighborhood turned out to be warm and charming. Autumn leaves, small parks, and friendly local life offered a very different and comforting side of St. Louis.

<center>
    <img style="border-radius: 0.3125em;
    box-shadow: 0 2px 4px 0 rgba(34,36,38,.12),0 2px 10px 0 rgba(34,36,38,.08);" 
    src="SC25%20Travel%20Report/65E82F5D-2B99-4630-901B-8652465D52A6_1_105_c.jpeg" width = "65%" alt=""/>
    <br>
    <div style="color:orange; border-bottom: 1px solid #d9d9d9;
    display: inline-block;
    color: #999;
    padding: 2px;">
      My Airbnb Stay
    </div>
</center>

<center>
    <img style="border-radius: 0.3125em;
    box-shadow: 0 2px 4px 0 rgba(34,36,38,.12),0 2px 10px 0 rgba(34,36,38,.08);" 
    src="SC25%20Travel%20Report/FCCE9CCA-D190-4E24-9971-D1AF66B27984_1_105_c.jpeg" width = "65%" alt=""/>
    <br>
    <div style="color:orange; border-bottom: 1px solid #d9d9d9;
    display: inline-block;
    color: #999;
    padding: 2px;">
      Autumn Scene, the Gate District
    </div>
</center>

### **San Francisco**


My flights to and from St. Louis both had stopovers in San Francisco. Although I stayed only a few hours each time, I still caught brief glimpses of the city’s vibrant character. California’s natural beauty—its blue skies, hills, and coastline—left a strong impression on me.

<center>
    <img style="border-radius: 0.3125em;
    box-shadow: 0 2px 4px 0 rgba(34,36,38,.12),0 2px 10px 0 rgba(34,36,38,.08);" 
    src="SC25%20Travel%20Report/B7D6A7BF-534D-4DD9-871E-4760B94F450E_1_105_c.jpeg" width = "65%" alt=""/>
    <br>
    <div style="color:orange; border-bottom: 1px solid #d9d9d9;
    display: inline-block;
    color: #999;
    padding: 2px;">
      “the Perfect Moment”, San Francisco Bay
    </div>
</center>

<center>
    <img style="border-radius: 0.3125em;
    box-shadow: 0 2px 4px 0 rgba(34,36,38,.12),0 2px 10px 0 rgba(34,36,38,.08);" 
    src="SC25%20Travel%20Report/2060A9D9-464C-4F2F-9B53-2DDBBEDDF9C3_1_105_c.jpeg" width = "65%" alt=""/>
    <br>
    <div style="color:orange; border-bottom: 1px solid #d9d9d9;
    display: inline-block;
    color: #999;
    padding: 2px;">
      Golden Gate Bridge
    </div>
</center>

### **Misc**

- I enjoyed talking with Uber and Lyft drivers during my rides. It’s a wonderful way to learn about local culture, hear personal stories, and improve communication skills.
- The locals in San Francisco were warm and welcoming. I was surprised to hear more Cantonese than Mandarin—it made me feel unexpectedly at home.
- I heard a wide range of political opinions during the trip. Missouri leans red and California leans blue, yet I met people in each place whose views didn’t fit the stereotype. It reminded me that American politics is complex and cannot be fully understood through simple labels.
- Diversity is a defining feature of America. In a single room, you may find people of different backgrounds, cultures, and languages. It is both inspiring and challenging to navigate such a rich environment.
- The journey is a very enriching and complicated experience. I shall write more about it in future posts.

# **Conclusion**

Attending SC25 in St. Louis has been an incredible experience that has broadened my horizons and deepened my understanding of the HPC field. From engaging keynote speeches to insightful technical sessions, I have gained valuable knowledge and made meaningful connections with fellow enthusiasts. The Student@SC program has provided me with opportunities for personal and professional growth, and I am grateful for the support and guidance I received from mentors and peers. As I reflect on my journey, I am inspired to continue exploring the exciting world of HPC and contribute to its advancement in the years to come.

What's more impressive is the journey itself—the challenges faced, the lessons learned, and the memories made along the way. This trip has not only enriched my academic pursuits but also broadened my perspective on life and the world around me. I really appreciate for the opportunity to travel across the United States at a young age and to see the country as it truly is—not the version portrayed in movies or medias, but the real one, with all its complexities and contradictions.  This experience has deepened my understanding of the country and its people, and I believe it will shape my worldview for years to come.
