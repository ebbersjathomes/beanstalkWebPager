Beanstalk Web Pager -- Work In Progress!!
=================

Priority Queue Web paging system utilizing bean stalk and Node.js

=================

<h3>Motivation</h3>
Expand Beanstalks priority queue to actively push jobs to Web Code that can than process them.

=================

<h3>Feature List</h3>
<ul>
  <li>Accept RESTful posts / put requests</li>
  <li>Based on a config file convert RESTful data and put that data into a specified Beanstalk Tube</li>
  <li>Based on a config file watch specified Beanstalk Tubes</li>
  <li>When a Job is received based on a config file post that data to a specified URL</li>
  <li>Maintain Job state based on the outcome of aforementioned post</li>
  <li>Reporting will be made availiabe both by JSON and Graph for monitoring</li>
  <li>Buried jobs will be automatically purged and optionally logged at a set interval</li>
</ul>
