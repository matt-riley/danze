require 'calabash-cucumber/ibase'

class View < Calabash::IBase
  BUTTON_CLASSES = File.readlines('./classes/buttons.txt').each { |line| line.delete!("\n") }

  TEXT_FIELD_CLASSES = File.readlines('./classes/text_fields.txt').each { |line| line.delete!("\n") }

  def initialize
    assign_items(find_items)
  end

  def button_toucher(button_name)
    method_checker("touch_#{button_name}")
    define_singleton_method("touch_#{button_name}") do
      touch(send(button_name.to_sym))
    end
  end

  def create_method(item, method_type)
    name = item['label'].gsub(/\s/, '_').gsub(/[\W]/, '').downcase
    method_name = "#{name}_#{method_type}"
    method_checker(method_name)
    define_singleton_method(method_name) do
      item
    end
    button_toucher(method_name) if method_type == 'button'
    fill_text(method_name) if method_type == 'text_field'
  end

  def fill_text(text_field)
    method_checker("fill_#{text_field}")
    define_singleton_method("fill_#{text_field}") do |text|
      touch(send(text_field.to_sym))
      fast_enter_text(text)
    end
  end

  def reload_items
    assign_items(find_items)
  end

  private

  def assign_items(items)
    items.each do |item|
      case item['class']
      when *BUTTON_CLASSES
        create_method(item, 'button') if item['visible'] == 1
      when *TEXT_FIELD_CLASSES
        create_method(item, 'text_field') if item['visible'] == 1
      else
        next
      end
    end
  end

  def find_items
    wait_for_none_animating
    query('all view')
  end

  def method_checker(method_name)
    instance_eval { undef :"#{method_name}" } if respond_to? method_name.to_sym
  end
end
