# Usage:
# rails runner scripts/import_questions.rb PATH_TO_RB_FILES
require "ripper"

class SafeQuestionLiteralParser
  def parse(source)
    sexp = Ripper.sexp(source)
    raise "could not parse source" if sexp.nil?

    parse_literal(sexp)
  end

  private

  def parse_literal(node)
    type, payload = node

    case type
    when :program
      expressions = payload
      raise "expected a single top-level expression" unless expressions.is_a?(Array) && expressions.size == 1

      parse_literal(expressions.first)
    when :array
      (payload || []).map { |child| parse_literal(child) }
    when :hash
      assoc_list = payload
      return {} if assoc_list.nil?

      unless assoc_list[0] == :assoclist_from_args
        raise "unsupported hash structure"
      end

      assoc_list[1].to_h do |assoc|
        raise "unsupported hash entry" unless assoc[0] == :assoc_new

        [ parse_hash_key(assoc[1]), parse_literal(assoc[2]) ]
      end
    when :string_literal
      parse_string(node)
    when :symbol_literal
      parse_symbol(node)
    when :var_ref
      parse_keyword(payload)
    when :@int
      payload.to_i
    when :@float
      payload.to_f
    when :unary
      operator = payload[0]
      value = parse_literal(payload[1])
      raise "unsupported unary operator" unless operator == :-
      raise "unsupported unary operand" unless value.is_a?(Numeric)

      -value
    else
      raise "unsupported node type #{type}"
    end
  end

  def parse_hash_key(node)
    case node[0]
    when :@label
      node[1].delete_suffix(":").to_sym
    when :symbol_literal
      parse_symbol(node)
    when :string_literal
      parse_string(node)
    else
      raise "unsupported hash key"
    end
  end

  def parse_string(node)
    type, payload = node
    raise "unsupported string node" unless type == :string_literal

    string_content = payload
    return "" if string_content.nil?
    raise "unsupported string content" unless string_content[0] == :string_content

    fragments = string_content[1..] || []

    fragments.map do |fragment|
      if fragment[0] == :@tstring_content
        fragment[1]
      else
        raise "string interpolation is not supported"
      end
    end.join
  end

  def parse_symbol(node)
    type, payload = node
    raise "unsupported symbol node" unless type == :symbol_literal

    symbol_node = payload
    raise "unsupported symbol structure" unless symbol_node[0] == :symbol

    token = symbol_node[1]

    case token[0]
    when :@ident, :@op, :@kw
      token[1].to_sym
    else
      raise "unsupported symbol token"
    end
  end

  def parse_keyword(node)
    raise "unsupported keyword node" unless node[0] == :@kw

    case node[1]
    when "true"
      true
    when "false"
      false
    when "nil"
      nil
    else
      raise "unsupported keyword #{node[1]}"
    end
  end
end

parser = SafeQuestionLiteralParser.new

Dir.glob(ARGV[0] || 'questions/**/*.rb').each do |file|
  topic_slug = File.basename(file, '.rb').split('_').first

  topic = InterviewTopic.find_by(slug: topic_slug)

  unless topic
    puts "SKIP: No topic found for slug '#{topic_slug}' (file: #{file})"
    next
  end

  source = File.read(file)

  questions = begin
    parser.parse(source)
  rescue StandardError => e
    puts "SKIP: Unsafe or unsupported content in '#{file}' (#{e.message})"
    next
  end

  unless questions.is_a?(Array) && questions.all? { |question| question.is_a?(Hash) }
    puts "SKIP: Expected an array of question hashes in '#{file}'"
    next
  end

  questions.each_with_index do |q, i|
    InterviewQuestion.find_or_create_by!(
      interview_topic: topic,
      question: q[:question]
    ) do |iq|
      iq.answer        = q[:answer]
      iq.level         = q[:level] || 'intermediate'
      iq.tags          = q[:tags] || []
      iq.target_roles  = q[:target_roles] || [ 'sde1', 'sde2' ]
      iq.is_premium    = q[:premium] || false
      iq.is_published  = true
      iq.order         = i
      iq.source_file   = file
    end
  end

  puts "Imported #{questions.size} questions for #{topic.name}"
end
