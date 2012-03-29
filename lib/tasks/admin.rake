namespace :admin do
  desc 'create some random phrases'
  task :create_phrases => :environment do
    100.times do
      Phrase.create!(text: Faker::Lorem.sentence(1))
    end
  end

end