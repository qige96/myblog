---
title: "5G Network Summary"
date: 2022-07-26T16:12:58+01:00
draft: false
---


This note is a summary of some key points and comments to the description of [5G](https://www.etsi.org/technologies/5g) network architecture, which is defined by [European Telecommunications Standards Institute. (ETSI)](https://www.etsi.org/).

## Network Architecture: Traditional versus Cloud Native

We all know that a computer network is a group of inter-connected computers, among which computers could communicate with one another. 

Traditionally, we need some devices to facilitate the networking ability, typically switches and routers, which are THE two key devices for computer network to forward messages. Moreover, there are some special devices implementing other functionalities, such as monitoring, traffic controlling, fee calculating, and so on. Even a medium size network could consist of a large amount of various devices. Therefore, Network deployment, operation, and maintenance could be a tough job. Administrators would need to spend many hours in installing and configuring these devices.

The recent rise and development of cloud computing technology and DevOps idea has inspired the design of next generation network architecture. We know that computational functions implemented by hardware, could also implemented by software. Then actually we can implement as many as possible functions via software, and don't need so many types of hardware devices. By this we can even install and manage these software functions in cloud, instead of so many individual computer devices. 

The new architecture is named [Services Based Architecture (SBA)](https://www.ericsson.com/en/blog/2017/9/service-based-architecture-in-5g), because all of the functions are implemented by software services. And as a comparison, we can informally call the traditional one as Devices Based Architecture. As the figure below, every block in the 3G/4G network architecture represents a group of hardware devices, also called Network Element (NE), while every block in the SBA architecture represents a group of software processes, also called Network Function (NF).

![4G system Architecture](/images/4g-sys-arch.png)
![5G system Architecture](/images/5g-sys-arch.png)

Traditionally, administrators need to configure every individual devices one by one. With modern native cloud support, we can group all controlling functions in one place, leading to Control User Plane Separation (CUPS). Putting all control functions in one place, though may raise other issues, can largely increase network flexibility, and reduce administration effort. This is the main idea of SDN —— [Software Defined Network (Wikipedia)](https://en.wikipedia.org/wiki/Software-defined_networking). 

Since a great proportion of network functions are now implemented by software, then the idea of DevOps could further help operation and maintenance. Traditionally, we have different kind of devices, carrying different responsibilities. Using virtual machines and containers, we can gain the same effect, and run different software, or same software of different versions, independently, and separately. This is the concept of NFV —— [Network Function Virtualization](https://www.etsi.org/technologies/nfv). A key benefit of NFV, is network slice, which means we can have several logical network with different configuration, to handle different business scenes, running in one physical network.


## Layered Architecture

The System Architecture of 5G Core network is defined by 3GPP group of ETSI. One version of the standard could be found [here]( https://www.etsi.org/deliver/etsi_ts/123500_123599/123501/15.03.00_60/ts_123501v150300p.pdf ). For comparison, here is one version of the [4G nnetwork system architecture standard](https://www.etsi.org/deliver/etsi_ts/123400_123499/123402/14.06.00_60/ts_123402v140600p.pdf).

A 5G network system can be seen as a layered architecture. A good analogy to this 5G network "Layered Architecture" is the famous TCP/IP suite. TCP/IP is also a layered architecture, in which the functions on the upper layer use the services provided by the lower layer. 

Layered architecture is a conceptual model. By representing all concepts into layers, in most cases we can focus our concern in only one layer, and safely ignore concepts in other layers. This is good for controlling complexity in designing, and manufacturing.

Theoretically, the concepts on the upper layer can be defined by the concepts merely on the lower layer that it close to. For example, HTTP is a protocol run upon TCP, and HTTP/3 is a protocol run upon UDP. Both TCP and UDP are both concepts in transport layer, we don't need to bother IP protocol, or even Ethernet protocol. 

Basically, 5G network system as 3 layers: Hardware layer, Virtualization layer, and Application layer. In the **hardware layer**, we think about CPU, memory, disk storage, bandwidth, and so on. In the **virtualization layer**, we think about cloud computing system, virtual machines, containers, DevOps, and so on. In the **application layer**, we think about software that could provide network services.

The Application layer into **NE layer**, **Network layer**, and **Service Layer**, leading to a 5 layer architecture. In the NE layer, what we see are various fundamental micro-services. In the Network layer, what we see are network functions defined by ETSI 5G standard, and telecom carriers. These network functions are implemented via micro-services in NE layer. In the service layer, what we see are all sorts of consumer-oriented service, such as IoT, cloud AR/VR, etc.


## Network Function

**Network function** is the key to understand 5G system architecture.

If we can use only one diagram to depict the 5G system, then it should be the following one. We can see that the entire 5G network is an organisation of Network Functions. To understand the 5G system, is essentially to understand what these NF do, and how they cooperate.

The whole network is  divided into 2 planes: **control plane** which provides access control, network configuration, session management, and other control functions, and the **user (data) plane**, which provide data transmit and other user-oriented network functions. A user equipment (UE) can access the Core Network via Access Network (AN), or directly via Access and Mobility Management Function (AMF) in the control plane. 

> Here is an excellent [blog post](https://medium.com/5g-nr/5g-service-based-architecture-sba-47900b0ded0a) explaining the key Network Functions in 5G Standard. 

To further increase modularization and flexibility, the 5G standard further define each Network Function as a collection of Network Function Services (NFS). Carriers could assemble NFS to form their own NF, according to their own need.

For easy understanding, here is an analogy. Every company can be divided into management layer, and business layer. In management layer, there might be different departments, like HR, Finance, Secretary, etc. Every department consist of different people, who can perform certain tasks. We can see control plane and user plane in the 5G system as management layer and business layer, departments as NF, and people in departments as NFS in NF. 

Take AMF as an example. The AMF network function usually consist of communication, location, event exposure, and other service. 

![AMF network services](/images/amf-services.png)

Among all network functions, the Network Repository Function (NRF) should deserve more attention, because it is responsible for manage hundreds of NF and NFS automatically. 

With the network evolution and continuous enhancement of product capabilities, the 5G Core Network will provide more and more NF and NFS. How can hundreds or thousands of these NF/NFS be managed? If engineers still rely on traditional manual maintenance, it would be a disaster. Therefore, the NF/NFS of the 5GC must support automated management. An NRF is the key to NFS automated management. It maintains real-time information about all NF/NFS in the entire network, similar to an NFS real-time warehouse. 

The NRF supports NF/NFS registration, update, and deregistration. These operations are initiated and completed by an NF. During the registration, an NF sends all the information as the NF profile to the NRF. Each NF profile has an NFS list. In this way, the NF/NFS registration can be successful. When another NF needs to use a service, it queries and discovers the NF/NFS registered on the NRF. The NRF returns the information about the NFS and its NF. 

![Service Discovery by NRF](/images/NRF.png)

## Conclusion

- Compared with the traditional 3G/4G network,  modern 5G network system adopts the Software Based Architecture, which is much more flexible, modular, and easier to manage. 
- Traditional hardware based Network Elements, are now replaced by software based Network Functions. 

