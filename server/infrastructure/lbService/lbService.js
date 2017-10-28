var request = require('request');
var _ = require('underscore');

function updateProjects(projectModel, wpProjects) {
  projectModel.destroyAll();
  return new Promise(function(resolve, reject) {
    _.each(wpProjects, function(project) {
      const projectData = {
        title: project.title,
        slug: project.slug,
        content: project.content,
        authorName: project.author,
        price: project.price,
        canDonateMore: project.canDonateMore,
        thumbUrl: project.thumbnailUrl,
        shortDescription: project.shortDescription,
        status: project.status,
        dueDate: project.dueDate,
        published: true,
        category: project.categories ? project.categories[0].name : '',
        donationStatus: project.donationStatus,
        id: project.id,
      };
      try {
        projectModel.create(projectData, function (err, projectEntity) {
          projectEntity.projectStats.create({
            status: project.donationStatus,
            supporters: project.supporters,
            canDonate: project.canDonate,
            raised: project.raised,
          });
        });
      } catch (e) {
        reject(e);
      }
    });
    resolve();
  });
}


module.exports = {
  updateProjects: updateProjects
};